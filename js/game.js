
"use strict";

/* AYSSKY CARGO - GAME ENGINE */

const LEVELS = [
  {
    id: 1,
    name: "Türkiye",
    seconds: 120,
    orders: 4,
    quantity: [2, 4],
    destinationRegions: ["Turkey"],
    pickupHubs: ["ESB"]
  },
  {
    id: 2,
    name: "Europe",
    seconds: 210,
    orders: 5,
    quantity: [3, 6],
    destinationRegions: ["Europe"],
    pickupHubs: ["ESB", "IST"]
  },
  {
    id: 3,
    name: "World",
    seconds: 330,
    orders: 5,
    quantity: [5, 9],
    destinationRegions: ["World"],
    pickupHubs: ["ESB", "IST", "DXB"]
  }
];

const AIRCRAFT = [
  { name: "Mini Cargo", capacity: 5, tank: 25, upgrade: 0 },
  { name: "Cargo Plus", capacity: 10, tank: 50, upgrade: 35 },
  { name: "Cargo Max", capacity: 15, tank: 80, upgrade: 75 }
];

const START_COINS = 20;
const START_FUEL = 18;
const HINT_COST = 3;
const WRONG_ANSWER_SECONDS = 5;
const HIGH_SCORE_KEY = "aysskyCargoHighScoreV1";

let highScore = 0;

try {
  highScore =
    Number(localStorage.getItem(HIGH_SCORE_KEY)) || 0;
} catch (_) {}

const game = {
  started: false,
  finished: false,
  flying: false,
  checking: false,
  wonLevel: false,
  level: 1,
  aircraftLevel: 0,
  fuel: START_FUEL,
  coins: START_COINS,
  score: 0,
  timeLeft: LEVELS[0].seconds,
  cargo: [],
  selectedAirport: null
};

let currentAirport = airportById("ESB");
let orders = [];
let gameDeadline = 0;
let gameTimer = null;
let flightAnimation = null;

let question = null;
let usedQuestions = {};
let eliminatedOptions = [];

const $ = id => document.getElementById(id);

const settings = () => LEVELS[game.level - 1];
const aircraft = () => AIRCRAFT[game.aircraftLevel];

const cargoCount = () =>
  game.cargo.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

const loadedFor = id =>
  game.cargo
    .filter(item => item.orderId === id)
    .reduce((sum, item) => sum + item.quantity, 0);

const completedOrders = () =>
  orders.filter(
    order => order.delivered === order.quantity
  ).length;

const remainingSeconds = () =>
  Math.max(0, (gameDeadline - Date.now()) / 1000);

function formatTime(seconds) {
  return (
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:` +
    `${String(seconds % 60).padStart(2, "0")}`
  );
}

function notify(message) {
  $("message-box").textContent = message;
}

function saveHighScore() {
  if (game.score <= highScore) return;

  highScore = game.score;

  try {
    localStorage.setItem(
      HIGH_SCORE_KEY,
      String(highScore)
    );
  } catch (_) {}
}

/* =====================================
   HELPERS
===================================== */

function orderRewardPerPackage(order) {
  const pickup = airportById(order.pickup);
  const destination = airportById(order.destination);

  const distance = calculateDistance(
    pickup.lat,
    pickup.lon,
    destination.lat,
    destination.lon
  );

  return 3 + Math.ceil(distance / 700);
}

function fuelUnitsNeeded() {
  return Math.max(0, aircraft().tank - game.fuel);
}

function refuelUnitPrice() {
  return currentAirport.id === "ESB" ? 4 : 6;
}

/* =====================================
   INTRO SCREEN
===================================== */

function hideIntro() {
  $("intro-overlay").hidden = true;
}

function showIntro() {
  $("intro-overlay").hidden = false;
}

/* =====================================
   RANDOM ORDERS
===================================== */

function generateOrders() {
  const level = settings();

  const pool = shuffle(
    AIRPORTS.filter(airport =>
      level.destinationRegions.includes(airport.region) &&
      !level.pickupHubs.includes(airport.id)
    )
  );

  if (pool.length < level.orders) {
    throw new Error(
      "Not enough airports for this level."
    );
  }

  const pickups = shuffle(
    Array.from(
      { length: level.orders },
      (_, i) =>
        level.pickupHubs[i % level.pickupHubs.length]
    )
  );

  orders = pool
    .slice(0, level.orders)
    .map((destination, i) => ({
      id: i + 1,
      pickup: pickups[i],
      destination: destination.id,
      quantity:
        level.quantity[0] +
        Math.floor(
          Math.random() *
          (level.quantity[1] - level.quantity[0] + 1)
        ),
      delivered: 0
    }));
}

/* =====================================
   CARGO HUBS
===================================== */

function renderHubList() {
  const container = $("hub-list");
  container.replaceChildren();

  settings().pickupHubs.forEach(id => {
    const airport = airportById(id);

    const chip = document.createElement("span");
    chip.className = "hub-chip";
    chip.textContent =
      `${airport.city} (${airport.id})`;

    container.append(chip);
  });
}

/* =====================================
   LOADED CARGO
===================================== */

function renderCargo() {
  const container = $("cargo-list");
  container.replaceChildren();

  if (!game.cargo.length) {
    container.textContent = "No cargo loaded.";
    return;
  }

  game.cargo.forEach(item => {
    const order = orders.find(
      o => o.id === item.orderId
    );

    const div = document.createElement("div");
    div.className = "cargo-item";

    div.textContent =
      `${airportById(order.pickup).city} → ` +
      `${airportById(item.destination).city}: ` +
      `${item.quantity} package(s)`;

    container.append(div);
  });
}

/* =====================================
   ORDER CARD HELPERS
===================================== */

function createOrderInfo(label, value) {
  const row = document.createElement("div");
  row.className = "order-extra-row";

  const left = document.createElement("span");
  left.textContent = label;

  const right = document.createElement("strong");
  right.textContent = value;

  row.append(left, right);
  return row;
}

function createOrderBox(label, value) {
  const box = document.createElement("div");
  box.className = "order-box";

  const name = document.createElement("span");
  name.textContent = label;

  const number = document.createElement("strong");
  number.textContent = value;

  box.append(name, number);
  return box;
}

/* =====================================
   ORDER CARDS
===================================== */

function renderOrders() {
  const container = $("orders-list");
  container.replaceChildren();

  const freeSpace =
    aircraft().capacity - cargoCount();

  orders.forEach(order => {
    const pickup = airportById(order.pickup);
    const destination =
      airportById(order.destination);

    const loaded = loadedFor(order.id);

    const remaining =
      order.quantity -
      order.delivered -
      loaded;

    const completed =
      order.delivered === order.quantity;

    const flight =
      calculateFlight(pickup, destination);

    const card = document.createElement("article");

    card.className =
      "order-card" +
      (completed ? " completed" : "");

    const top = document.createElement("div");
    top.className = "order-route-line";

    const name = document.createElement("strong");
    name.textContent =
      `${pickup.city} → ${destination.city}`;

    const code = document.createElement("span");
    code.className = "order-code";
    code.textContent =
      `${pickup.id} → ${destination.id}`;

    top.append(name, code);

    const subtitle = document.createElement("p");
    subtitle.className = "order-subtitle";
    subtitle.textContent =
      `Pickup at ${pickup.city} · ` +
      `Deliver to ${destination.city}`;

    const grid = document.createElement("div");
    grid.className = "order-grid";

    grid.append(
      createOrderBox(
        "Delivered",
        `${order.delivered}/${order.quantity}`
      ),
      createOrderBox(
        "On Board",
        String(loaded)
      ),
      createOrderBox(
        "At Pickup",
        String(remaining)
      )
    );

    const details = document.createElement("div");
    details.className = "order-extra";

    details.append(
      createOrderInfo("📍 Pickup hub", pickup.city),
      createOrderInfo(
        "✈ Delivery city",
        destination.city
      ),
      createOrderInfo(
        "⏱ Route time",
        `${flight.time} sec`
      ),
      createOrderInfo(
        "⛽ Route fuel",
        String(flight.fuel)
      ),
      createOrderInfo(
        "🪙 Reward",
        `${orderRewardPerPackage(order)} / package`
      ),
      createOrderInfo(
        "📦 Free space now",
        String(freeSpace)
      )
    );

    card.append(top, subtitle, grid, details);

    if (completed) {
      const status = document.createElement("p");
      status.className = "order-status";
      status.textContent =
        "✓ Order completed · +20 points";

      card.append(status);
    } else {
      const button = document.createElement("button");
      button.type = "button";

      button.textContent =
        currentAirport.id === order.pickup
          ? "Load Packages"
          : `Go to ${pickup.city} to load`;

      // The entire order must fit in the aircraft.
      button.disabled =
        !game.started ||
        game.finished ||
        game.flying ||
        game.checking ||
        currentAirport.id !== order.pickup ||
        remaining <= 0 ||
        freeSpace < remaining;

      button.addEventListener("click", () => {
        loadCargo(order.id);
      });

      card.append(button);
    }

    container.append(card);
  });
}

/* =====================================
   FLIGHT WARNINGS
===================================== */

function getFlightStatus(destination) {
  if (!game.started) {
    return {
      canFly: false,
      message: "Start the game first."
    };
  }

  if (game.finished) {
    return {
      canFly: false,
      message: game.wonLevel
        ? "Level completed. Start the next level or restart."
        : "Level is over. Restart the game."
    };
  }

  if (game.flying) {
    return {
      canFly: false,
      message: "Aircraft is already in flight."
    };
  }

  if (game.checking) {
    return {
      canFly: false,
      message:
        "Complete the delivery check before flying again."
    };
  }

  if (!destination) {
    return {
      canFly: false,
      message:
        "Select a destination airport on the map."
    };
  }

  if (destination.id === currentAirport.id) {
    return {
      canFly: false,
      message:
        "You are already at this airport."
    };
  }

  const flight =
    calculateFlight(currentAirport, destination);

  if (game.fuel < flight.fuel) {
    return {
      canFly: false,
      message:
        `Not enough fuel. Need ${flight.fuel}, ` +
        `you have ${game.fuel}.`
    };
  }

  if (game.coins < flight.coins) {
    return {
      canFly: false,
      message:
        `Not enough coins. Need ${flight.coins}, ` +
        `you have ${game.coins}.`
    };
  }

  if (remainingSeconds() <= flight.time) {
    return {
      canFly: false,
      message:
        `Not enough time. Need ${flight.time} sec, ` +
        `remaining ${Math.ceil(remainingSeconds())} sec.`
    };
  }

  return {
    canFly: true,
    message: "Ready for departure."
  };
}

/* =====================================
   FLIGHT INFORMATION PANEL
===================================== */

function updateFlightDisplays() {
  const destination = game.selectedAirport;
  const status = getFlightStatus(destination);

  const badge = $("planner-route-badge");
  const warning = $("flight-warning");

  if (!destination) {
    $("planner-route-title").textContent =
      "No route selected";

    [
      "planner-distance",
      "planner-time",
      "planner-fuel",
      "planner-coins"
    ].forEach(id => {
      $(id).textContent = "-";
    });

    $("quick-route-summary").textContent =
      "No destination selected";

    $("quick-route-detail").textContent =
      "Choose an airport on the map to preview the flight.";
  } else {
    const flight =
      calculateFlight(currentAirport, destination);

    $("planner-route-title").textContent =
      `${currentAirport.city} → ${destination.city}`;

    $("planner-distance").textContent =
      `${flight.distance} km`;

    $("planner-time").textContent =
      `${flight.time} sec`;

    $("planner-fuel").textContent = flight.fuel;
    $("planner-coins").textContent = flight.coins;

    $("quick-route-summary").textContent =
      `${currentAirport.city} → ${destination.city}`;

    $("quick-route-detail").textContent =
      `Distance ${flight.distance} km · ` +
      `Fuel ${flight.fuel} · ` +
      `Fee ${flight.coins} coins · ` +
      `Time ${flight.time} sec`;
  }

  badge.textContent =
    !destination
      ? "WAITING"
      : status.canFly
        ? "READY"
        : "BLOCKED";

  badge.className =
    `route-badge ${status.canFly ? "ready" : "blocked"}`;

  warning.textContent = status.message;

  warning.className =
    `flight-warning ${status.canFly ? "ready" : ""}`;

  $("fly-button").disabled = !status.canFly;
}

/* =====================================
   MAIN PANEL UPDATE
===================================== */

function updatePanel() {
  $("level-label").textContent =
    `Level ${game.level} · ${settings().name}`;

  $("current-location").textContent =
    `${currentAirport.city} (${currentAirport.id})`;

  $("timer").textContent =
    formatTime(game.timeLeft);

  $("progress").textContent =
    `${completedOrders()} / ${settings().orders}`;

  $("fuel").textContent =
    `${game.fuel} / ${aircraft().tank}`;

  $("coins").textContent = game.coins;
  $("score").textContent = game.score;
  $("high-score").textContent = highScore;

  $("aircraft-name").textContent =
    aircraft().name;

  $("cargo-count").textContent =
    `${cargoCount()} / ${aircraft().capacity}`;

  $("capacity-fill").style.width =
    `${100 * cargoCount() / aircraft().capacity}%`;

  renderHubList();
  renderCargo();
  renderOrders();
  updateFlightDisplays();

  const next = AIRCRAFT[game.aircraftLevel + 1];

  const canOperate =
    game.started &&
    !game.finished &&
    !game.flying &&
    !game.checking;

  $("upgrade-description").textContent = next
    ? `${next.name} · Capacity ${next.capacity} · Fuel tank ${next.tank}`
    : "Maximum aircraft upgrade reached.";

  $("upgrade-button").textContent = next
    ? `Upgrade (${next.upgrade} Coins)`
    : "MAX LEVEL";

  $("upgrade-button").disabled =
    !next ||
    !canOperate ||
    currentAirport.id !== "ESB" ||
    game.coins < next.upgrade;

  $("refuel-button").textContent =
    `Buy 5 Fuel (${refuelUnitPrice()} Coins)`;

  $("refuel-button").disabled =
    !canOperate ||
    fuelUnitsNeeded() === 0 ||
    game.coins < refuelUnitPrice();

  const fillCost =
    Math.ceil(fuelUnitsNeeded() / 5) *
    refuelUnitPrice();

  $("fill-button").textContent =
    `Fill Tank (${fillCost} Coins)`;

  $("fill-button").disabled =
    !canOperate ||
    fuelUnitsNeeded() === 0 ||
    game.coins < fillCost;

  $("next-button").hidden = !(
    game.finished &&
    game.wonLevel &&
    game.level < LEVELS.length
  );
}

/* =====================================
   CARGO LOADING - FIXED
===================================== */

function loadCargo(orderId) {
  if (
    !game.started ||
    game.finished ||
    game.flying ||
    game.checking
  ) return;

  const order = orders.find(
    o => o.id === orderId
  );

  if (!order) return;

  if (currentAirport.id !== order.pickup) {
    notify(
      `Go to ${airportById(order.pickup).city} ` +
      `to collect this order.`
    );
    return;
  }

  const remaining =
    order.quantity -
    order.delivered -
    loadedFor(orderId);

  const freeSpace =
    aircraft().capacity - cargoCount();

  if (remaining <= 0) {
    notify(
      "This order is already loaded or delivered."
    );
    return;
  }

  // Orders cannot be divided into smaller groups.
  if (remaining > freeSpace) {
    notify(
      `Not enough cargo space! ` +
      `This order needs ${remaining} slots, ` +
      `but only ${freeSpace} are available.`
    );
    return;
  }

  // Automatically load all packages of this order.
  game.cargo.push({
    orderId: order.id,
    destination: order.destination,
    quantity: remaining
  });

  notify(
    `All ${remaining} packages for ` +
    `${airportById(order.destination).city} ` +
    `loaded successfully!`
  );

  updatePanel();
}

/* =====================================
   DELIVER CARGO
===================================== */

function deliverCargo() {
  if (game.finished) return;

  const matched = game.cargo.filter(
    item => item.destination === currentAirport.id
  );

  if (!matched.length) return;

  let coinsEarned = 0;
  let pointsEarned = 0;
  let packageCount = 0;

  matched.forEach(item => {
    const order = orders.find(
      o => o.id === item.orderId
    );

    if (!order) return;

    const wasComplete =
      order.delivered === order.quantity;

    order.delivered = Math.min(
      order.quantity,
      order.delivered + item.quantity
    );

    packageCount += item.quantity;

    coinsEarned +=
      item.quantity * orderRewardPerPackage(order);

    if (
      !wasComplete &&
      order.delivered === order.quantity
    ) {
      pointsEarned += 20;
    }
  });

  game.coins += coinsEarned;
  game.score += pointsEarned;

  game.cargo = game.cargo.filter(
    item => item.destination !== currentAirport.id
  );

  notify(
    `Delivery approved: ${packageCount} package(s), ` +
    `+${coinsEarned} coins, ` +
    `+${pointsEarned} points.`
  );

  if (completedOrders() === settings().orders) {
    endLevel(true);
  } else {
    updatePanel();
  }
}

/* =====================================
   FUEL SYSTEM
===================================== */

function buyFuel(full = false) {
  if (
    !game.started ||
    game.finished ||
    game.flying ||
    game.checking
  ) return;

  const amount = full
    ? fuelUnitsNeeded()
    : Math.min(5, fuelUnitsNeeded());

  if (amount <= 0) {
    notify("Fuel tank is already full.");
    return;
  }

  const cost =
    Math.ceil(amount / 5) * refuelUnitPrice();

  if (game.coins < cost) {
    notify(
      `Not enough coins. Need ${cost} coins.`
    );
    return;
  }

  game.coins -= cost;
  game.fuel += amount;

  notify(
    `+${amount} fuel purchased for ${cost} coins.`
  );

  updatePanel();
}

/* =====================================
   AIRCRAFT UPGRADES
===================================== */

function upgradeAircraft() {
  if (
    !game.started ||
    game.finished ||
    game.flying ||
    game.checking ||
    currentAirport.id !== "ESB"
  ) return;

  const next = AIRCRAFT[game.aircraftLevel + 1];

  if (!next) {
    notify("Maximum aircraft upgrade reached.");
    return;
  }

  if (game.coins < next.upgrade) {
    notify(
      `Not enough coins. Need ${next.upgrade} coins.`
    );
    return;
  }

  game.coins -= next.upgrade;
  game.aircraftLevel++;

  notify(
    `${next.name} unlocked! ` +
    `Capacity ${next.capacity}, tank ${next.tank}.`
  );

  updatePanel();
}

/* =====================================
   FLIGHT SELECTION
===================================== */

function selectFlight(airport) {
  if (
    !game.started ||
    game.finished ||
    game.flying ||
    game.checking
  ) return;

  if (airport.id === currentAirport.id) {
    notify("You are already at this airport.");
    return;
  }

  game.selectedAirport = airport;

  drawRoute(currentAirport, airport);

  updatePanel();
}

/* =====================================
   START FLIGHT
===================================== */

function startFlight() {
  const destination = game.selectedAirport;
  const status = getFlightStatus(destination);

  if (!status.canFly) {
    notify(status.message);
    updatePanel();
    return;
  }

  const origin = currentAirport;

  const flight =
    calculateFlight(origin, destination);

  game.fuel -= flight.fuel;
  game.coins -= flight.coins;
  game.flying = true;
  game.selectedAirport = null;

  updateMapStatus(
    `Flying ${origin.city} → ${destination.city} ` +
    `(${flight.distance} km)`
  );

  notify(
    `Flight started: ${origin.city} → ${destination.city}.`
  );

  updatePanel();

  const start = performance.now();
  const duration = flight.time * 1000;

  function frame(now) {
    if (game.finished || !game.flying) return;

    const progress = Math.min(
      1,
      (now - start) / duration
    );

    movePlane(
      origin.lat +
        (destination.lat - origin.lat) * progress,

      origin.lon +
        (destination.lon - origin.lon) * progress
    );

    if (progress < 1) {
      flightAnimation =
        requestAnimationFrame(frame);
    } else {
      flightAnimation = null;
      completeFlight(destination);
    }
  }

  flightAnimation = requestAnimationFrame(frame);
}

/* =====================================
   ARRIVAL
===================================== */

function completeFlight(destination) {
  if (game.finished) return;

  currentAirport = destination;
  game.flying = false;

  movePlane(destination.lat, destination.lon);
  clearRoute();

  updateMapStatus(
    `Arrived at ${destination.city}.`
  );

  const hasDelivery = game.cargo.some(
    item => item.destination === destination.id
  );

  if (hasDelivery) {
    openDeliveryCheck();
  } else {
    notify(
      `Arrived in ${destination.city}. ` +
      `No cargo to deliver here.`
    );
  }

  updatePanel();
}

/* =====================================
   GEOGRAPHY QUESTIONS
===================================== */

function nextQuestion(airportId) {
  const all = QUESTIONS[airportId];

  if (!all || !all.length) {
    throw new Error(
      `Missing question bank for ${airportId}`
    );
  }

  if (!usedQuestions[airportId]) {
    usedQuestions[airportId] = [];
  }

  let pool = all
    .map((_, index) => index)
    .filter(
      index =>
        !usedQuestions[airportId].includes(index)
    );

  if (!pool.length) {
    usedQuestions[airportId] = [];
    pool = all.map((_, index) => index);
  }

  const index = shuffle(pool)[0];

  usedQuestions[airportId].push(index);

  question = all[index];
  eliminatedOptions = [];
}

function openDeliveryCheck() {
  if (game.finished || game.checking) return;

  game.checking = true;

  nextQuestion(currentAirport.id);

  $("quiz-destination").textContent =
    `${currentAirport.city}, ${currentAirport.country} · ` +
    `answer correctly to deliver`;

  $("quiz-overlay").hidden = false;
  $("quiz-feedback").textContent = "";

  renderQuestion();
}

function renderQuestion() {
  if (!question || game.finished) return;

  $("quiz-question").textContent = question[0];

  const container = $("quiz-options");
  container.replaceChildren();

  question[1].forEach((choice, index) => {
    const button = document.createElement("button");

    button.className = "quiz-option";
    button.type = "button";

    button.textContent =
      `${String.fromCharCode(65 + index)}. ${choice}`;

    button.disabled =
      eliminatedOptions.includes(index);

    button.addEventListener("click", () => {
      submitAnswer(index);
    });

    container.append(button);
  });

  $("quiz-hint").disabled =
    eliminatedOptions.length > 0 ||
    game.coins < HINT_COST;
}

/* =====================================
   QUIZ HINT
===================================== */

function useHint() {
  if (
    !game.checking ||
    game.finished ||
    game.coins < HINT_COST ||
    eliminatedOptions.length
  ) return;

  game.coins -= HINT_COST;

  eliminatedOptions = shuffle(
    [0, 1, 2, 3].filter(
      index => index !== question[2]
    )
  ).slice(0, 2);

  renderQuestion();

  $("quiz-feedback").textContent =
    "Hint used: two incorrect answers removed.";

  updatePanel();
}

/* =====================================
   QUIZ ANSWER
===================================== */

function submitAnswer(index) {
  if (
    !game.checking ||
    game.finished ||
    !question ||
    eliminatedOptions.includes(index)
  ) return;

  if (index === question[2]) {
    game.checking = false;
    question = null;

    $("quiz-overlay").hidden = true;
    $("quiz-feedback").textContent = "";

    deliverCargo();
  } else {
    gameDeadline -=
      WRONG_ANSWER_SECONDS * 1000;

    updateTimer();

    if (game.finished) return;

    nextQuestion(currentAirport.id);
    renderQuestion();

    $("quiz-feedback").textContent =
      `Incorrect answer: -${WRONG_ANSWER_SECONDS} ` +
      `seconds. Try another question.`;

    updatePanel();
  }
}

/* =====================================
   GAME TIMER
===================================== */

function updateTimer() {
  if (!game.started || game.finished) return;

  game.timeLeft = Math.max(
    0,
    Math.ceil(remainingSeconds())
  );

  $("timer").textContent =
    formatTime(game.timeLeft);

  if (game.timeLeft === 0) {
    endLevel(false);
  } else if (game.selectedAirport) {
    updateFlightDisplays();
  }
}

/* =====================================
   CLEAN UP TIMERS
===================================== */

function clearActiveProcesses() {
  clearInterval(gameTimer);
  gameTimer = null;

  if (flightAnimation !== null) {
    cancelAnimationFrame(flightAnimation);
    flightAnimation = null;
  }
}

/* =====================================
   LEVEL END
===================================== */

function endLevel(won) {
  if (game.finished) return;

  game.finished = true;
  game.wonLevel = won;
  game.flying = false;
  game.checking = false;

  clearActiveProcesses();

  $("quiz-overlay").hidden = true;

  if (won) {
    game.score += 25;
  } else {
    game.timeLeft = 0;
  }

  saveHighScore();

  const message = won
    ? (
        game.level === LEVELS.length
          ? `All levels completed! Final score: ${game.score}`
          : `Level ${game.level} completed! +25 bonus points.`
      )
    : (
        `Time is up. You completed ` +
        `${completedOrders()} / ${settings().orders} orders.`
      );

  notify(message);
  updateMapStatus(message);

  $("start-button").textContent = "Restart Game";

  updatePanel();
}

/* =====================================
   PREPARE LEVEL
===================================== */

function prepareLevel() {
  clearActiveProcesses();

  const level = settings();

  game.started = true;
  game.finished = false;
  game.flying = false;
  game.checking = false;
  game.wonLevel = false;

  game.timeLeft = level.seconds;
  game.cargo = [];
  game.selectedAirport = null;

  currentAirport = airportById("ESB");

  game.fuel =
    level.id === 1
      ? START_FUEL
      : aircraft().tank;

  question = null;
  eliminatedOptions = [];

  $("quiz-overlay").hidden = true;
  $("quiz-feedback").textContent = "";

  generateOrders();
  drawAirports(level.id);

  movePlane(
    currentAirport.lat,
    currentAirport.lon
  );

  clearRoute();

  gameDeadline =
    Date.now() + level.seconds * 1000;

  gameTimer = setInterval(updateTimer, 150);

  $("start-button").textContent = "Restart Game";

  updateMapStatus(
    `Level ${game.level} started.`
  );

  notify(
    `Level ${game.level} started. ` +
    `Load cargo from active hubs and ` +
    `complete all deliveries.`
  );

  updatePanel();
}

/* =====================================
   START / NEXT LEVEL
===================================== */

function startNewGame() {
  hideIntro();

  game.level = 1;
  game.aircraftLevel = 0;
  game.coins = START_COINS;
  game.score = 0;
  game.fuel = START_FUEL;

  usedQuestions = {};

  prepareLevel();
}

function nextLevel() {
  if (
    !game.finished ||
    !game.wonLevel ||
    game.level >= LEVELS.length
  ) return;

  game.level++;
  prepareLevel();
}

/* =====================================
   BUTTON EVENT LISTENERS
===================================== */

$("start-button").addEventListener(
  "click",
  startNewGame
);

$("next-button").addEventListener(
  "click",
  nextLevel
);

$("fly-button").addEventListener(
  "click",
  startFlight
);

$("upgrade-button").addEventListener(
  "click",
  upgradeAircraft
);

$("refuel-button").addEventListener(
  "click",
  () => buyFuel(false)
);

$("fill-button").addEventListener(
  "click",
  () => buyFuel(true)
);

$("quiz-hint").addEventListener(
  "click",
  useHint
);

$("intro-start-button").addEventListener(
  "click",
  startNewGame
);

$("intro-close-button").addEventListener(
  "click",
  hideIntro
);

/* =====================================
   INITIAL SCREEN
===================================== */

drawAirports(1);
updatePanel();
showIntro();

console.log("AYSSKY CARGO game ready.");
