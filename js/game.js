
/* SKY CARGO - GAME LOGIC */

// Initial game settings
const LEVEL_TIME = 120;
const ORDER_TARGET = 4;

const game = {
    started: false,
    finished: false,
    flying: false,
    fuel: 40,
    maxFuel: 40,
    coins: 18,
    score: 0,
    timeLeft: LEVEL_TIME,
    capacity: 5,
    selectedAirport: null,
    cargo: []
};

let orders = [];
let gameTimer = null;
let flightAnimation = null;
let gameDeadline = 0;

// ---------- HELPERS ----------

function airportById(id) {
    return airports.find(a => a.id === id);
}

function cargoCount() {
    return game.cargo.reduce(
        (sum, item) => sum + item.quantity, 0
    );
}

function loadedForOrder(id) {
    return game.cargo
        .filter(item => item.orderId === id)
        .reduce((sum, item) => sum + item.quantity, 0);
}

function completedOrders() {
    return orders.filter(
        order => order.delivered === order.quantity
    ).length;
}

function packageReward(destinationId) {
    const ankara = airportById("ESB");
    const destination = airportById(destinationId);

    const distance = calculateDistance(
        ankara.lat,
        ankara.lon,
        destination.lat,
        destination.lon
    );

    return 3 + Math.ceil(distance / 500);
}

// ---------- RANDOM ORDERS ----------

function generateOrders() {
    const destinations = airports
        .filter(a => a.id !== "ESB");

    // Shuffle destinations
    const shuffled = [...destinations].sort(
        () => Math.random() - 0.5
    );

    orders = shuffled.slice(0, ORDER_TARGET).map(
        (airport, index) => ({
            id: index + 1,
            destination: airport.id,
            quantity: 1 + Math.floor(Math.random() * 3),
            delivered: 0
        })
    );
}

// ---------- NOTIFICATIONS ----------

function showMessage(text) {
    const box = document.getElementById("message-box");

    box.textContent = text;
    box.classList.add("visible");
}

// ---------- INTERFACE ----------

function updateGamePanel() {
    document.getElementById("current-location").textContent =
        currentAirport.city;

    document.getElementById("fuel").textContent = game.fuel;
    document.getElementById("coins").textContent = game.coins;
    document.getElementById("score").textContent = game.score;

    document.getElementById("progress").textContent =
        `${completedOrders()} / ${ORDER_TARGET}`;

    const minutes = Math.floor(game.timeLeft / 60);
    const seconds = game.timeLeft % 60;

    document.getElementById("timer").textContent =
        `${String(minutes).padStart(2, "0")}:` +
        `${String(seconds).padStart(2, "0")}`;

    document.getElementById("cargo-count").textContent =
        `${cargoCount()} / ${game.capacity}`;

    document.getElementById("capacity-fill").style.width =
        `${(cargoCount() / game.capacity) * 100}%`;

    renderCargo();
    renderOrders();
    updateRefuelButton();
}

// ---------- CARGO DISPLAY ----------

function renderCargo() {
    const container = document.getElementById("cargo-list");
    container.innerHTML = "";

    if (game.cargo.length === 0) {
        container.textContent = "No cargo loaded.";
        return;
    }

    game.cargo.forEach(item => {
        const airport = airportById(item.destination);
        const div = document.createElement("div");

        div.className = "cargo-item";
        div.textContent =
            `📦 ${airport.city}: ${item.quantity} packages`;

        container.appendChild(div);
    });
}

// ---------- ORDERS DISPLAY ----------

function renderOrders() {
    const container = document.getElementById("orders-list");
    container.innerHTML = "";

    orders.forEach(order => {
        const airport = airportById(order.destination);
        const completed =
            order.delivered === order.quantity;

        const loaded = loadedForOrder(order.id);
        const remaining =
            order.quantity - order.delivered - loaded;

        const card = document.createElement("div");
        card.className =
            "order-card" + (completed ? " completed" : "");

        const title = document.createElement("h3");
        title.textContent = `📍 ${airport.city}`;

        const details = document.createElement("p");
        details.textContent =
            `Delivered: ${order.delivered}/${order.quantity}` +
            ` | Loaded: ${loaded}`;

        const reward = document.createElement("p");
        reward.textContent =
            `Reward: ${packageReward(order.destination)}` +
            ` coins / package`;

        card.appendChild(title);
        card.appendChild(details);
        card.appendChild(reward);

        if (completed) {
            const status = document.createElement("p");
            status.textContent = "✅ Completed!";
            card.appendChild(status);
        } else {
            const button = document.createElement("button");
            button.textContent = "Load Packages";

            button.disabled =
                !game.started ||
                game.finished ||
                game.flying ||
                currentAirport.id !== "ESB" ||
                cargoCount() >= game.capacity ||
                remaining <= 0;

            button.addEventListener("click", () => {
                loadCargo(order.id);
            });

            card.appendChild(button);
        }

        container.appendChild(card);
    });
}

// ---------- LOAD PACKAGES ----------

function loadCargo(orderId) {
    if (!game.started || game.finished || game.flying) return;
    if (currentAirport.id !== "ESB") return;

    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const available =
        order.quantity -
        order.delivered -
        loadedForOrder(order.id);

    const freeSpace = game.capacity - cargoCount();
    const quantity = Math.min(available, freeSpace);

    if (quantity <= 0) return;

    const existing = game.cargo.find(
        item => item.orderId === order.id
    );

    if (existing) {
        existing.quantity += quantity;
    } else {
        game.cargo.push({
            orderId: order.id,
            destination: order.destination,
            quantity: quantity
        });
    }

    showMessage(`${quantity} packages loaded.`);
    updateGamePanel();
}

// ---------- DELIVER PACKAGES ----------

function deliverCargo() {
    const items = game.cargo.filter(
        item => item.destination === currentAirport.id
    );

    if (items.length === 0) return;

    let earnedCoins = 0;
    let deliveredCount = 0;

    items.forEach(item => {
        const order = orders.find(
            o => o.id === item.orderId
        );

        order.delivered += item.quantity;
        deliveredCount += item.quantity;

        earnedCoins +=
            item.quantity * packageReward(item.destination);

        game.score += item.quantity * 10;

        if (order.delivered === order.quantity) {
            game.score += 20;
        }
    });

    game.coins += earnedCoins;

    game.cargo = game.cargo.filter(
        item => item.destination !== currentAirport.id
    );

    showMessage(
        `${deliveredCount} packages delivered! ` +
        `+${earnedCoins} coins`
    );

    updateGamePanel();
    checkLevelComplete();
}

// ---------- REFUEL ----------

function refuelCost() {
    return currentAirport.id === "ESB" ? 4 : 6;
}

function updateRefuelButton() {
    const button = document.getElementById("refuel-button");

    button.textContent =
        `Buy 5 Fuel (${refuelCost()} Coins)`;

    button.disabled =
        !game.started ||
        game.finished ||
        game.flying ||
        game.coins < refuelCost() ||
        game.fuel >= game.maxFuel;
}

function buyFuel() {
    if (!game.started || game.finished || game.flying) return;

    const cost = refuelCost();

    if (game.coins < cost || game.fuel >= game.maxFuel) {
        return;
    }

    const amount = Math.min(5, game.maxFuel - game.fuel);

    game.coins -= cost;
    game.fuel += amount;

    showMessage(`+${amount} fuel purchased.`);
    updateGamePanel();
    refreshFlightSelection();
}

// ---------- FLIGHT SELECTION ----------

function selectFlight(airport) {
    if (!game.started || game.finished || game.flying) return;

    game.selectedAirport = airport;
    refreshFlightSelection();
}

function refreshFlightSelection() {
    const airport = game.selectedAirport;
    if (!airport) return;

    const flight = calculateFlight(currentAirport, airport);

    document.getElementById("flight-info").textContent =
        `${currentAirport.city} → ${airport.city}\n` +
        `Distance: ${flight.distance} km\n` +
        `Fuel: ${flight.fuel}\n` +
        `Coins: ${flight.coins}\n` +
        `Flight time: ${flight.time} seconds`;

    document.getElementById("flight-info").style.whiteSpace =
        "pre-line";

    document.getElementById("fly-button").disabled =
        game.fuel < flight.fuel ||
        game.coins < flight.coins ||
        game.timeLeft < flight.time;
}

// ---------- FLIGHT ANIMATION ----------

function startFlight() {
    if (!game.started || game.flying || game.finished) return;

    const destination = game.selectedAirport;
    if (!destination || destination.id === currentAirport.id) {
        return;
    }

    const origin = currentAirport;
    const flight = calculateFlight(origin, destination);

    if (
        game.fuel < flight.fuel ||
        game.coins < flight.coins ||
        game.timeLeft < flight.time
    ) {
        showMessage("Not enough resources or time.");
        return;
    }

    game.fuel -= flight.fuel;
    game.coins -= flight.coins;
    game.flying = true;

    document.getElementById("fly-button").disabled = true;

    updateMapStatus(
        `Flying: ${origin.city} → ${destination.city}`
    );

    updateGamePanel();

    const duration = flight.time * 1000;
    const startTime = performance.now();

    function animate(now) {
        if (game.finished) return;

        const progress = Math.min(
            (now - startTime) / duration, 1
        );

        // Coordinate interpolation
        const lat = origin.lat +
            (destination.lat - origin.lat) * progress;

        const lon = origin.lon +
            (destination.lon - origin.lon) * progress;

        movePlane(lat, lon);

        if (progress < 1) {
            flightAnimation = requestAnimationFrame(animate);
        } else {
            flightAnimation = null;
            completeFlight(destination);
        }
    }

    flightAnimation = requestAnimationFrame(animate);
}

// ---------- ARRIVAL ----------

function completeFlight(destination) {
    if (game.finished) return;

    currentAirport = destination;
    movePlane(destination.lat, destination.lon);

    game.flying = false;
    game.selectedAirport = null;

    clearRoute();
    map.closePopup();

    document.getElementById("flight-info").textContent =
        "Select your next destination.";

    document.getElementById("fly-button").disabled = true;

    updateMapStatus(
        `Arrived at ${destination.city}.`
    );

    deliverCargo();
    updateGamePanel();
}

// ---------- GAME END ----------

function finishGame(won) {
    if (game.finished) return;

    game.finished = true;
    game.flying = false;

    clearInterval(gameTimer);
    gameTimer = null;

    if (flightAnimation !== null) {
        cancelAnimationFrame(flightAnimation);
        flightAnimation = null;
    }

    if (won) {
        game.score += 50;
        game.score += Math.floor(game.timeLeft / 10);
    }

    document.getElementById("fly-button").disabled = true;
    document.getElementById("start-button").textContent =
        "Play Again";

    const result = won
        ? `🎉 LEVEL COMPLETED! Score: ${game.score}`
        : `⏱ GAME OVER! Completed: ` +
          `${completedOrders()}/${ORDER_TARGET}`;

    showMessage(result);
    updateMapStatus(result);
    updateGamePanel();
}

function checkLevelComplete() {
    if (completedOrders() === ORDER_TARGET) {
        finishGame(true);
    }
}

// ---------- GAME TIMER ----------

function updateTimer() {
    if (!game.started || game.finished) return;

    game.timeLeft = Math.max(
        0,
        Math.ceil((gameDeadline - Date.now()) / 1000)
    );

    document.getElementById("timer").textContent =
        `${String(Math.floor(game.timeLeft / 60)).padStart(2, "0")}:` +
        `${String(game.timeLeft % 60).padStart(2, "0")}`;

    if (game.timeLeft <= 0) {
        finishGame(false);
    }
}

// ---------- START / RESTART ----------

function startGame() {
    clearInterval(gameTimer);

    if (flightAnimation !== null) {
        cancelAnimationFrame(flightAnimation);
        flightAnimation = null;
    }

    game.started = true;
    game.finished = false;
    game.flying = false;

    game.fuel = 40;
    game.coins = 18;
    game.score = 0;
    game.timeLeft = LEVEL_TIME;
    game.capacity = 5;

    game.cargo = [];
    game.selectedAirport = null;

    currentAirport = airportById("ESB");
    movePlane(currentAirport.lat, currentAirport.lon);

    clearRoute();
    map.closePopup();

    generateOrders();

    document.getElementById("fly-button").disabled = true;
    document.getElementById("flight-info").textContent =
        "Select an airport on the map.";

    document.getElementById("start-button").textContent =
        "Restart Game";

    document.getElementById("message-box")
        .classList.remove("visible");

    updateMapStatus(
        "Game started! Load your packages in Ankara."
    );

    gameDeadline = Date.now() + LEVEL_TIME * 1000;

    gameTimer = setInterval(updateTimer, 200);

    updateGamePanel();
}

// ---------- BUTTONS ----------

document.getElementById("start-button")
    .addEventListener("click", startGame);

document.getElementById("fly-button")
    .addEventListener("click", startFlight);

document.getElementById("refuel-button")
    .addEventListener("click", buyFuel);

// Initial screen
updateGamePanel();

console.log("Sky Cargo game ready!");
