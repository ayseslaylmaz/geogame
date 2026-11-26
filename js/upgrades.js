
/* SKY CARGO - AIRCRAFT UPGRADES */

const aircraftLevels = [
    {
        name: "Mini Cargo",
        capacity: 5,
        price: 0
    },
    {
        name: "Cargo Plus",
        capacity: 10,
        price: 35
    },
    {
        name: "Cargo Max",
        capacity: 15,
        price: 75
    }
];

let aircraftLevel = 0;

// Create upgrade interface
function createUpgradePanel() {
    const panel = document.querySelector(".aircraft-panel");

    const section = document.createElement("div");
    section.className = "upgrade-section";

    section.innerHTML = `
        <h3>Aircraft Upgrades</h3>
        <p id="aircraft-name">Mini Cargo</p>
        <p id="upgrade-description">
            Capacity: 5 packages
        </p>
        <button id="upgrade-button" type="button">
            Upgrade Aircraft
        </button>
    `;

    panel.appendChild(section);

    const style = document.createElement("style");

    style.textContent = `
        .upgrade-section {
            margin-top: 20px;
            padding: 15px;
            border-radius: 12px;
            background: #eff6ff;
            border: 1px solid #bfdbfe;
        }

        .upgrade-section h3 {
            color: #1e3a5f;
            margin: 0 0 12px;
        }

        #aircraft-name {
            font-weight: bold;
            color: #2563eb;
        }

        #upgrade-description {
            font-size: 13px;
            line-height: 1.6;
            margin: 10px 0;
        }

        #upgrade-button {
            width: 100%;
            background: #7c3aed;
        }

        #upgrade-button:hover:not(:disabled) {
            background: #6d28d9;
        }
    `;

    document.head.appendChild(style);

    document.getElementById("upgrade-button")
        .addEventListener("click", upgradeAircraft);

    updateUpgradePanel();
}

// Update upgrade button and information
function updateUpgradePanel() {
    const button = document.getElementById("upgrade-button");

    if (!button) return;

    const current = aircraftLevels[aircraftLevel];
    const next = aircraftLevels[aircraftLevel + 1];

    document.getElementById("aircraft-name")
        .textContent = current.name;

    if (!next) {
        document.getElementById("upgrade-description")
            .textContent = "Maximum capacity: 15 packages";

        button.textContent = "MAX LEVEL";
        button.disabled = true;
        return;
    }

    document.getElementById("upgrade-description")
        .textContent =
        `Current capacity: ${current.capacity} | ` +
        `Next: ${next.capacity} packages`;

    button.textContent =
        `Upgrade (${next.price} Coins)`;

    button.disabled =
        !game.started ||
        game.finished ||
        game.flying ||
        game.checking ||
        currentAirport.id !== "ESB" ||
        game.coins < next.price;
}

// Purchase aircraft upgrade
function upgradeAircraft() {
    if (
        !game.started ||
        game.finished ||
        game.flying ||
        game.checking ||
        currentAirport.id !== "ESB"
    ) return;

    const next = aircraftLevels[aircraftLevel + 1];

    if (!next || game.coins < next.price) return;

    game.coins -= next.price;
    game.capacity = next.capacity;
    aircraftLevel++;

    showMessage(
        `${next.name} unlocked! ` +
        `Capacity increased to ${next.capacity}.`
    );

    updateGamePanel();
    updateUpgradePanel();
}

// Keep upgrade state synchronized with game updates
const originalUpdateGamePanel = updateGamePanel;

updateGamePanel = function() {
    originalUpdateGamePanel();
    updateUpgradePanel();
};

// Reset aircraft on a fresh Level 1 game
const originalStartGame = startGame;

startGame = function() {
    aircraftLevel = 0;
    originalStartGame();
    game.capacity = aircraftLevels[0].capacity;
    updateGamePanel();
};

// Replace the existing start-button listener
document.getElementById("start-button")
    .removeEventListener("click", originalStartGame);

document.getElementById("start-button")
    .addEventListener("click", startGame);

createUpgradePanel();

console.log("Aircraft upgrade system ready!");
