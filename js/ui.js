
/* =========================================
   SKY CARGO - UI ENHANCEMENTS

   Updates only the display of:
   - Order cards
   - Flight preview

   Game rules remain in game.js.
========================================= */

"use strict";

/* =========================================
   CREATE A SMALL TEXT ELEMENT
========================================= */

function uiElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text !== undefined) {
        element.textContent = text;
    }

    return element;
}

/* =========================================
   ORDER INFORMATION ROW
========================================= */

function createOrderInfo(label, value) {
    const row = uiElement(
        "div",
        "order-extra-row"
    );

    const name = uiElement(
        "span",
        "",
        label
    );

    const result = uiElement(
        "strong",
        "",
        value
    );

    row.append(name, result);

    return row;
}

/* =========================================
   ORDER METRIC
========================================= */

function createOrderMetric(label, value) {
    const box = uiElement(
        "div",
        "order-metric"
    );

    const name = uiElement(
        "span",
        "",
        label
    );

    const number = uiElement(
        "strong",
        "",
        value
    );

    box.append(name, number);

    return box;
}

/* =========================================
   NEW ORDER CARDS
========================================= */

renderOrders = function() {

    const container =
        document.getElementById("orders-list");

    container.replaceChildren();

    for (const order of orders) {

        const destination =
            airportById(order.destination);

        if (!destination) continue;

        const loaded =
            loadedFor(order.id);

        const remaining = Math.max(
            0,
            order.quantity -
            order.delivered -
            loaded
        );

        const completed =
            order.delivered === order.quantity;

        // Estimate from current airport
        const flight = calculateFlight(
            currentAirport,
            destination
        );

        const reward =
            coinsPerPackage(order.destination);

        const card = uiElement(
            "article",
            "order-card" +
            (completed ? " completed" : "")
        );

        /* TITLE */

        const top = uiElement(
            "div",
            "order-top"
        );

        const city = uiElement(
            "h3",
            "order-city",
            "📍 " + destination.city
        );

        const code = uiElement(
            "span",
            "order-code",
            destination.id
        );

        top.append(city, code);

        const subtitle = uiElement(
            "p",
            "order-subtitle",
            destination.country +
            " · Cargo delivery"
        );

        /* PACKAGE METRICS */

        const metrics = uiElement(
            "div",
            "order-metrics"
        );

        metrics.append(
            createOrderMetric(
                "Delivered",
                `${order.delivered}/${order.quantity}`
            ),
            createOrderMetric(
                "On Board",
                String(loaded)
            ),
            createOrderMetric(
                "At Depot",
                String(remaining)
            )
        );

        /* EXTRA INFORMATION */

        const extra = uiElement(
            "div",
            "order-extra"
        );

        extra.append(
            createOrderInfo(
                "✈ Flight distance",
                flight.distance + " km"
            ),
            createOrderInfo(
                "⏱ Estimated flight",
                flight.time + " sec"
            ),
            createOrderInfo(
                "⛽ Fuel needed",
                String(flight.fuel)
            ),
            createOrderInfo(
                "🪙 Delivery income",
                reward + " / package"
            )
        );

        card.append(
            top,
            subtitle,
            metrics,
            extra
        );

        /* COMPLETED ORDER */

        if (completed) {

            const status = uiElement(
                "p",
                "order-status",
                "✓ Order Completed · +20 Points"
            );

            card.append(status);

        } else {

            const button = uiElement(
                "button",
                "",
                "📦 Load Packages"
            );

            button.type = "button";

            button.disabled =
                !game.started ||
                game.finished ||
                game.flying ||
                game.checking ||
                currentAirport.id !== "ESB" ||
                cargoCount() >= aircraft().capacity ||
                remaining === 0;

            button.addEventListener(
                "click",
                function() {
                    loadCargo(order.id);
                }
            );

            card.append(button);
        }

        container.append(card);
    }
};

/* =========================================
   FLIGHT PLANNER DETAIL ROW
========================================= */

function createFlightDetail(label, value) {
    const row = uiElement(
        "div",
        "flight-detail-row"
    );

    const name = uiElement(
        "span",
        "flight-detail-label",
        label
    );

    const result = uiElement(
        "strong",
        "flight-detail-value",
        value
    );

    row.append(name, result);

    return row;
}

/* =========================================
   NEW FLIGHT PREVIEW
========================================= */

showFlightPreview = function() {

    const destination =
        game.selectedAirport;

    if (!destination) return;

    const flight = calculateFlight(
        currentAirport,
        destination
    );

    const container =
        document.getElementById("flight-info");

    container.replaceChildren();

    const details = uiElement(
        "div",
        "flight-details"
    );

    const routeTitle = uiElement(
        "div",
        "flight-route-title",
        currentAirport.city +
        " → " +
        destination.city
    );

    details.append(
        routeTitle,

        createFlightDetail(
            "📍 Distance",
            flight.distance + " km"
        ),

        createFlightDetail(
            "⏱ Flight time",
            flight.time + " sec"
        ),

        createFlightDetail(
            "⛽ Fuel cost",
            String(flight.fuel)
        ),

        createFlightDetail(
            "🪙 Flight fee",
            flight.coins + " coins"
        )
    );

    container.append(details);

    document.getElementById("fly-button")
        .disabled =
        !canAffordFlight(destination);
};

/* =========================================
   REFRESH INITIAL DISPLAY
========================================= */

updatePanel();

console.log(
    "Sky Cargo interface enhancements ready!"
);
