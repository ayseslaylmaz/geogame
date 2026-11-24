
/* SKY CARGO - INTERACTIVE MAP */

let currentAirport = airports.find(a => a.id === "ESB");

const map = L.map("map", {
    worldCopyJump: false,
    maxZoom: 12
}).setView([39.0, 35.0], 6);

// Basemap
L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
        noWrap: true
    }
).addTo(map);

// Route preview
let routeLine = null;

// Aircraft symbol
const planeIcon = L.divIcon({
    className: "plane-marker",
    html: '<div class="plane-icon">✈️</div>',
    iconSize: [36, 36],
    iconAnchor: [18, 18]
});

const planeMarker = L.marker(
    [currentAirport.lat, currentAirport.lon],
    {
        icon: planeIcon,
        zIndexOffset: 1000
    }
).addTo(map);

// Move plane to a specific geographic coordinate
function movePlane(lat, lon) {
    planeMarker.setLatLng([lat, lon]);
}

// Clear route preview
function clearRoute() {
    if (routeLine) {
        map.removeLayer(routeLine);
        routeLine = null;
    }
}

// Draw a route between two airports
function drawRoute(from, to) {
    clearRoute();

    routeLine = L.polyline([
        [from.lat, from.lon],
        [to.lat, to.lon]
    ], {
        color: "#2563eb",
        weight: 4,
        dashArray: "8, 6"
    }).addTo(map);
}

// Update map status
function updateMapStatus(message) {
    document.getElementById("map-status").textContent =
        message;
}

// Airport markers
airports.forEach(function(airport) {

    const marker = L.circleMarker(
        [airport.lat, airport.lon],
        {
            radius: 7,
            color: "#ffffff",
            weight: 2,
            fillColor: "#0f766e",
            fillOpacity: 1
        }
    ).addTo(map);

    marker.bindTooltip(
        `${airport.city} (${airport.id})`
    );

    marker.on("click", function() {

        if (!game.started || game.finished || game.flying) {
            return;
        }

        if (airport.id === currentAirport.id) {
            updateMapStatus(
                `Your aircraft is already in ${airport.city}.`
            );
            return;
        }

        selectFlight(airport);
        drawRoute(currentAirport, airport);

        const flight = calculateFlight(
            currentAirport,
            airport
        );

        marker.bindPopup(`
            <strong>${airport.city} (${airport.id})</strong>
            <p>Distance: ${flight.distance} km</p>
            <p>Fuel: ${flight.fuel}</p>
            <p>Flight time: ${flight.time}s</p>
        `).openPopup();
    });
});

console.log("Interactive airport map ready!");
