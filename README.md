# ✈ AYSSKY CARGO — A Web-Based Geographic Cargo Delivery Game

**GMT458 — Web GIS | Hacettepe University | Geomatics Engineering**

### 🎮 Play the Game

AYSSKY CARGO is an interactive geographic cargo delivery game that can be played directly in a web browser.

**🌍 [Click Here to Play AYSSKY CARGO](https://ayseslaylmaz.github.io/geogame/)**

**💻 [View the Project on GitHub](https://github.com/ayseslaylmaz/geogame)**

---

## 1. Project Overview

**AYSSKY CARGO** is a web-based geographic game (GeoGame) developed using HTML, CSS, and JavaScript for the GMT458 Web GIS course.

In the game, the player controls a cargo aircraft and delivers packages between airports in different cities and countries. The main goal is to complete all delivery orders before the time runs out and achieve the highest possible score.

During gameplay, players must consider geographic locations, distances between airports, flight routes, fuel consumption, coins, and aircraft capacity. Players must also answer geography questions correctly to complete deliveries.

The game has three geographic levels: **Türkiye, Europe, and the World**. As the levels progress, the geographic area becomes larger and route planning becomes more important.

### Main Features

- Interactive map developed with Leaflet
- OpenStreetMap base map
- Geographic coordinates of 35 real airports
- Distance calculations and flight route planning
- Animated aircraft movement
- Cargo loading and delivery system
- Geography question bank containing 68 questions
- Fuel, coins, and aircraft capacity management
- Aircraft upgrade system
- Three levels with countdown timers
- Scoring and high-score system
- Pause and Resume functionality
- Flight warnings and result screens
- Turkish and English interface options

## 2. Game Objectives and Functional Requirements

The main objective of the game is to collect packages from active cargo hubs, deliver them to the correct airports, and complete all tasks within the given time.

### Functional Requirements

| Code | Requirement | Description |
|---|---|---|
| FR1 | Interactive Map | Players should be able to view and select airports on the map. |
| FR2 | Route Planning | The game should calculate flight distance, flight time, fuel consumption, and coin cost. |
| FR3 | Cargo Management | Players should be able to load packages at active cargo hubs. |
| FR4 | Aircraft Animation | The aircraft should move between the departure and destination airports. |
| FR5 | Delivery Verification | Players should answer a geography question correctly to complete a delivery. |
| FR6 | Resource Management | Fuel, coins, and cargo capacity should be updated during gameplay. |
| FR7 | Aircraft Upgrades | Players should be able to purchase aircraft with larger cargo capacities. |
| FR8 | Time Management | Each level should have a countdown timer and end when time runs out. |
| FR9 | Scoring | Completed orders should give points, and the high score should be saved. |
| FR10 | Dynamic Interface | Orders, flight information, and game status should be updated using JavaScript. |
| FR11 | Game Controls | Players should be able to pause and resume the game. |
| FR12 | Language Support | The interface should provide Turkish and English language options. |

## 3. Frontend Layout Design

The AYSSKY CARGO interface is designed with three main sections so that players can follow the map and game information at the same time.

**Left Panel — Flight Details and Aircraft:** This panel displays the current location, selected route, flight distance, estimated flight time, fuel, coins, cargo capacity, and aircraft upgrades.

**Center Panel — Interactive Map:** The Leaflet map displays airports, active cargo hubs, the aircraft's position, and selected flight routes.

**Right Panel — Orders:** This panel displays pickup locations, delivery destinations, package quantities, and delivery status.

### Proposed Frontend Layout Sketch

```text
+--------------------------------------------------------------+
| AYSSKY CARGO    Level / Timer    TR/EN    Help    Pause       |
+----------------+-----------------------------+---------------+
|                |                             |               |
| FLIGHT         |                             | ORDERS        |
| DETAILS        |                             |               |
|                |      INTERACTIVE MAP        | Pickup        |
| Location       |                             | Destination   |
| Distance       |      Airport Markers        | Packages      |
| Flight Time    |      Cargo Hubs             | On Board      |
| Fuel Cost      |      Aircraft and Routes    | Delivered     |
| Coin Cost      |                             |               |
+----------------+-----------------------------+---------------+
| AIRCRAFT       |      ROUTE PLANNING         | ORDER         |
| INFORMATION    |                             | ACTIONS       |
|                |      Select Destination     |               |
| Fuel           |      Start Flight           | Load Packages |
| Coins          |      Flight Warnings        |               |
| Capacity       |                             |               |
| Upgrades       |                             |               |
+----------------+-----------------------------+---------------+
|                    GAME NOTIFICATIONS                        |
+--------------------------------------------------------------+
```

The interface uses cream, soft pink, and burgundy colors. Buttons, notifications, warnings, and status indicators help players understand the game.

Geography questions, the game guide, Pause/Resume, and level results are displayed in separate windows.

## 4. Game Progression and Difficulty Levels

The game consists of three geographic levels. Players must complete all delivery orders in each level.

| Feature | Level 1 | Level 2 | Level 3 |
|---|---|---|---|
| Geographic Area | Türkiye | Europe | World |
| Time Limit | 120 seconds | 210 seconds | 360 seconds |
| Number of Orders | 4 | 5 | 4 |
| Packages per Order | 2–4 | 3–6 | 3–5 |
| Active Cargo Hubs | Ankara | Ankara, Istanbul | Ankara, Istanbul, Dubai |
| Difficulty | Beginner | Intermediate | Advanced |

### Level 1 — Türkiye

The player starts at Ankara Esenboğa Airport and delivers packages to different airports in Türkiye. This level introduces the basic game mechanics.

### Level 2 — Europe

The geographic area expands to Europe. Ankara and Istanbul are active cargo hubs. Longer flights, more orders, and multiple pickup locations make route planning more important.

### Level 3 — World

Airports around the world become delivery destinations. Ankara, Istanbul, and Dubai are active cargo hubs. Long distances and resource management require more strategic decisions.

When players complete all orders in a level, they receive bonus points and can continue to the next level.

## 5. Tasks and Geography Questions

The main tasks in the game are cargo deliveries between airports.

Each delivery order includes a pickup airport, a destination airport, and a package quantity.

### Number of Tasks

- **Level 1:** 4 delivery orders
- **Level 2:** 5 delivery orders
- **Level 3:** 4 delivery orders

There are **13 delivery tasks** across all three levels.

### Geography Question Bank

The `js/questions.js` file contains **68 geography questions for 34 airports**. Each of these airports has two different questions.

The questions cover countries, cities, geographic regions, rivers, seas, mountains, historical landmarks, and cultural features.

Each question has four answer options. The index of the correct answer is stored in a JavaScript array.

When the player arrives at a delivery destination with cargo, a geography question appears.

- A correct answer completes the delivery.
- An incorrect answer reduces the remaining time by 5 seconds and displays another question.
- A hint costs 3 coins and removes two incorrect options.

Players do not need to answer every question in the question bank during one game. The number of questions depends on the delivery destinations and incorrect answers.

## 6. Lives and Failure Conditions

The game does not have a traditional life or health system.

Instead, it uses time limits and resource management.

If the time runs out before all delivery orders are completed, the player fails the level.

Poor route choices, insufficient fuel or coins, and inefficient use of aircraft capacity can also make deliveries more difficult.

Incorrect geography answers do not remove lives. Instead, each incorrect answer causes a **5-second time penalty**.

## 7. Scoring and High-Score System

AYSSKY CARGO awards points for completed delivery orders and successfully completed levels.

| Game Action | Reward or Effect |
|---|---|
| Complete one delivery order | +20 points |
| Complete one level | +25 bonus points |
| Deliver packages | Earn coins based on distance and package quantity |
| Incorrect answer | −5 seconds |
| Use a hint | −3 coins |
| Complete a flight | Spend fuel and coins |

Players receive points only when an entire delivery order is completed. Loading packages alone does not give points.

The highest score is saved in the browser using JavaScript `localStorage`.

This allows players to see their previous record when they return to the game using the same browser.

## 8. Temporal Component

Time is one of the main gameplay mechanics in AYSSKY CARGO.

Each level has a countdown timer. Players must complete all deliveries before the time runs out.

Time affects gameplay in three ways:

**Level Time Limits:** Different time limits are used for Türkiye, Europe, and World levels.

**Flight Duration:** Flight time is calculated based on the geographic distance between airports. Longer flights generally require more time.

**Geography Questions:** Each incorrect answer reduces the remaining time by 5 seconds.

The Pause/Resume feature allows players to temporarily stop the game. While paused, the countdown timer and aircraft animation stop. The game continues from the same position when resumed.

This system combines geographic knowledge with time management and decision-making skills.

## 9. Aircraft and Resource Management

Players start the game with the Mini Cargo aircraft.

| Aircraft | Cargo Capacity | Fuel Tank | Upgrade Cost |
|---|---|---|---|
| Mini Cargo | 5 packages | 25 units | Starting aircraft |
| Cargo Plus | 10 packages | 50 units | 35 coins |
| Cargo Max | 15 packages | 80 units | 75 coins |

Aircraft upgrades are available at Ankara Esenboğa Airport.

Players can purchase fuel using coins. Fuel is cheaper in Ankara than at other airports.

Each flight consumes fuel and coins according to its distance.

All packages in an order must fit within the aircraft's available capacity. Orders cannot be divided into smaller groups.

These mechanics encourage players to manage resources and plan routes carefully.

## 10. Geographic Information and Spatial Analysis

Geographic information is directly used in the main gameplay mechanics of AYSSKY CARGO.

The game uses latitude and longitude coordinates to display real airport locations on the map.

The approximate great-circle distance between airports is calculated using the **Haversine formula**.

Distance information affects:

- Flight route planning
- Estimated flight duration
- Fuel consumption
- Flight costs
- Coin rewards earned from deliveries

Therefore, geographic coordinates and spatial relationships are not only visual elements. They are essential to the game's functionality.

## 11. Technologies and Libraries

| Technology | Purpose |
|---|---|
| HTML5 | Structure of the web page |
| CSS3 | Interface design and visual layout |
| JavaScript | Game logic, interactions, timers, and animations |
| Leaflet | Interactive geographic map |
| OpenStreetMap | Base map |
| localStorage | High-score storage |
| Git | Version control |
| GitHub | Project file management |
| GitHub Pages | Online game hosting |

The game is developed as a client-side web application. It does not require a separate application server or database.

## 12. Geographic Dataset

The project includes **35 airports**.

| Geographic Group | Number of Airports |
|---|---:|
| Türkiye | 15 |
| Europe | 10 |
| World category | 10 |
| **Total** | **35** |

Airport information is stored in the `js/airports.js` file.

Each airport includes the following attributes:

- Airport code (`id`)
- City (`city`)
- Country (`country`)
- Geographic region (`region`)
- Latitude (`lat`)
- Longitude (`lon`)

The data is stored as JavaScript objects and used for map visualization and flight calculations.

The game uses **[OpenStreetMap](https://www.openstreetmap.org/)** as its geographic base map.

Airport coordinates are stored in a local dataset within the project. The original external source of these coordinates has not yet been verified.

## 13. JavaScript Event Handler Implementation

JavaScript event handlers are used to manage user interactions in the game.

### 13.1. Starting a Flight

```javascript
$("fly-button").addEventListener(
  "click",
  startFlight
);
```

When the player clicks the flight button, the `startFlight()` function is called.

The function checks the flight requirements and starts the aircraft animation if the flight is possible.

### 13.2. Loading Cargo

```javascript
button.addEventListener("click", () => {
  loadCargo(order.id);
});
```

When the player clicks a loading button, the event handler uses the corresponding order ID to load packages into the aircraft.

### 13.3. Answering a Geography Question

```javascript
button.addEventListener("click", () => {
  submitAnswer(index);
});
```

The player's selected answer is passed to the `submitAnswer()` function.

A correct answer completes the delivery, while an incorrect answer applies a time penalty.

These examples demonstrate how JavaScript event handlers are used in different parts of the game.

## 14. JavaScript Closure Implementation

A **closure** is a JavaScript feature that allows a function to access variables from its surrounding lexical scope.

One example of closure usage in AYSSKY CARGO is the aircraft animation.

The `frame()` function is defined inside the `startFlight()` function. It can access the origin, destination, and flight duration variables from the outer function.

```javascript
function startFlight() {
  const origin = currentAirport;
  const destination = game.selectedAirport;

  const flight = calculateFlight(origin, destination);
  const duration = flight.time * 1000;

  function frame(now) {
    const progress = Math.min(
      1,
      (now - flightStartTime) / duration
    );

    movePlane(
      origin.lat +
        (destination.lat - origin.lat) * progress,
      origin.lon +
        (destination.lon - origin.lon) * progress
    );
  }

  requestAnimationFrame(frame);
}
```

In this example, the `frame()` function accesses `origin`, `destination`, and `duration` from its outer scope.

These values are used to update the aircraft's geographic position during the animation.

Another closure example is found in the order button event handlers, where each button accesses its own `order.id`.

## 15. DOM Manipulation

The **Document Object Model (DOM)** represents the structure of an HTML document and allows JavaScript to access and modify page elements.

AYSSKY CARGO uses DOM manipulation to update the game interface dynamically.

### 15.1. Updating the Timer

```javascript
$("timer").textContent = formatTime(game.timeLeft);
```

This statement updates the countdown timer displayed on the page.

### 15.2. Creating Order Cards

```javascript
const card = document.createElement("article");
container.append(card);
```

JavaScript creates new HTML elements and adds them to the order list.

### 15.3. Displaying the Geography Quiz

```javascript
$("quiz-overlay").hidden = false;
```

The quiz window becomes visible when the player arrives at a delivery destination.

Other DOM methods and properties used in the project include `replaceChildren()`, `append()`, `className`, `style`, and `textContent`.

## 16. User Experience and Game Controls

The user interface is designed to help players view important information while planning flights.

- Airports and active cargo hubs have different map markers.
- The selected flight route is displayed on the map.
- Aircraft movement is animated.
- Flights are blocked when fuel, coins, or time are insufficient.
- Warning messages inform players about risky flights.
- Order cards are updated according to delivery status.
- The help window explains gameplay rules.
- The Pause/Resume feature allows players to stop and continue the game.
- A congratulations screen appears after completing a level.
- Players can try again when the time runs out.
- The final screen displays the score and high score after the last level.

These features are designed to create a clear, interactive, and strategic gameplay experience.

## 17. What I Learned from AI Tools

During the development of AYSSKY CARGO, I used ChatGPT as a learning and coding support tool.

Through these interactions, I studied and practiced:

- Developing a browser-based game using HTML, CSS, and JavaScript
- Creating interactive maps using Leaflet
- Using JavaScript event handlers
- Understanding closures through animation examples
- Creating and updating DOM elements dynamically
- Developing countdown timers and Pause/Resume functionality
- Managing game state, scoring, and resources
- Finding and fixing JavaScript and CSS errors
- Balancing game difficulty and improving user experience

AI explanations and code suggestions were reviewed and used according to the project requirements.

---