
"use strict";

/* =====================================
   AYSSKY CARGO - MAP
   New airport and cargo hub markers
===================================== */

const map = L.map("map", {
  worldCopyJump: false,
  zoomControl: true,
  zoomSnap: 0.5
}).setView([39.3, 35], 6);

const baseLayer = L.tileLayer(
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
    minZoom: 2,
    noWrap: true,
    keepBuffer: 4,
    updateWhenIdle: true
  }
).addTo(map);

baseLayer.on("tileerror", function (event) {
  console.warn("Map tile failed:", event.tile.src);
});

const airportLayer = L.layerGroup().addTo(map);
const routeLayer = L.layerGroup().addTo(map);

/* ACTIVE CARGO HUBS */

function hubIdsForLevel(level) {
  if (level === 1) return ["ESB"];
  if (level === 2) return ["ESB", "IST"];
  return ["ESB", "IST", "DXB"];
}

/* SVG ICONS */

/* Small airplane for ordinary airports */
const airportSVG = `
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="currentColor"
  >
    <path d="
      M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9
      l-8 5v2l8-2.5V19l-2 1.5V22
      l3.5-1 3.5 1v-1.5L13 19v-5.5z
    "/>
  </svg>
`;

/* Cargo box for active hubs */
const cargoHubSVG = `
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M3 7 12 3l9 4v10l-9 4-9-4V7z"/>
    <path d="m3 7 9 4 9-4"/>
    <path d="M12 11v10"/>
    <path d="m8 5 9 4"/>
  </svg>
`;

/* Larger aircraft icon */
const playerPlaneSVG = `
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="currentColor"
  >
    <path d="
      M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9
      l-8 5v2l8-2.5V19
      l-2 1.5V22l3.5-1 3.5 1v-1.5
      L13 19v-5.5z
    "/>
  </svg>
`;

/* =====================================
   AIRPORT MARKER
===================================== */

function createAirportIcon(airport, level) {
  const isHub =
    hubIdsForLevel(level).includes(airport.id);

  return L.divIcon({
    className: "ays-map-icon",
    html: isHub
      ? `
        <div class="ays-hub-marker">
          ${cargoHubSVG}
        </div>
      `
      : `
        <div class="ays-airport-marker">
          ${airportSVG}
        </div>
      `,
    iconSize: isHub ? [38, 38] : [29, 29],
    iconAnchor: isHub ? [19, 19] : [14.5, 14.5],
    tooltipAnchor: isHub ? [0, -21] : [0, -17]
  });
}

/* =====================================
   PLAYER PLANE
===================================== */

const aircraftIcon = L.divIcon({
  className: "ays-map-icon",
  html: `
    <div class="ays-player-marker">
      ${playerPlaneSVG}
    </div>
  `,
  iconSize: [48, 48],
  iconAnchor: [24, 24]
});

const planeMarker = L.marker(
  [40.1281, 32.9951],
  {
    icon: aircraftIcon,
    zIndexOffset: 1100,
    interactive: false
  }
).addTo(map);

function movePlane(lat, lon) {
  planeMarker.setLatLng([lat, lon]);
}

/* =====================================
   MAP STATUS
===================================== */

function updateMapStatus(text) {
  const status =
    document.getElementById("map-status");

  if (status) {
    status.textContent = text;
  }
}

/* =====================================
   VISIBLE AIRPORTS BY LEVEL
===================================== */

function visibleAirports(level) {
  return AIRPORTS.filter(airport => {
    if (level === 1) {
      return airport.region === "Turkey";
    }

    if (level === 2) {
      return (
        airport.region === "Turkey" ||
        airport.region === "Europe"
      );
    }

    return true;
  });
}

/* =====================================
   DRAW AIRPORT MARKERS
===================================== */

function drawAirports(level) {
  airportLayer.clearLayers();

  const visible = visibleAirports(level);
  const hubs = hubIdsForLevel(level);

  visible.forEach(airport => {
    const isHub = hubs.includes(airport.id);

    const marker = L.marker(
      [airport.lat, airport.lon],
      {
        icon: createAirportIcon(airport, level),
        keyboard: true,
        zIndexOffset: isHub ? 450 : 0
      }
    ).addTo(airportLayer);

    const typeText = isHub
      ? "📦 Active Cargo Hub"
      : "✈ Airport";

    marker.bindTooltip(
      `${typeText} · ${airport.city} (${airport.id}) · ${airport.country}`,
      {
        direction: "top",
        sticky: false,
        opacity: 0.98
      }
    );

    marker.on("click", function () {
      selectFlight(airport);
    });
  });

  const bounds = L.latLngBounds(
    visible.map(airport => [
      airport.lat,
      airport.lon
    ])
  );

  map.invalidateSize({ pan: false });

  if (bounds.isValid()) {
    map.fitBounds(
      bounds.pad(0.12),
      {
        animate: false,
        maxZoom: level === 1 ? 7 : 5.7
      }
    );
  }

  requestAnimationFrame(function () {
    map.invalidateSize({ pan: false });
  });

  setTimeout(function () {
    map.invalidateSize({ pan: false });
  }, 350);
}

/* =====================================
   FLIGHT ROUTE
===================================== */

function drawRoute(from, to) {
  routeLayer.clearLayers();

  L.polyline(
    [
      [from.lat, from.lon],
      [to.lat, to.lon]
    ],
    {
      color: "#8a5b6e",
      weight: 4,
      opacity: 0.95,
      dashArray: "9, 7"
    }
  ).addTo(routeLayer);
}

function clearRoute() {
  routeLayer.clearLayers();
}

/* =====================================
   RESPONSIVE MAP
===================================== */

window.addEventListener("resize", function () {
  map.invalidateSize({ pan: false });
});

console.log("AYSSKY CARGO map ready.");
