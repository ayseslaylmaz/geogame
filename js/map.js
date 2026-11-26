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

function hubIdsForLevel(level) {
  if (level === 1) return ["ESB"];
  if (level === 2) return ["ESB", "IST"];
  return ["ESB", "IST", "DXB"];
}

function createAirportIcon(airport, level) {
  const isHub = hubIdsForLevel(level).includes(airport.id);

  const airportSVG = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 12h18"/>
      <path d="M8 7l4 5-4 5"/>
      <path d="M13 7l4 5-4 5"/>
    </svg>
  `;

  return L.divIcon({
    className: "",
    html: `
      <div class="airport-marker ${isHub ? "hub-marker" : ""}">
        ${airportSVG}
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    tooltipAnchor: [0, -18]
  });
}

const planeSVG = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="
      M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19
      l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z
    "/>
  </svg>
`;

const aircraftIcon = L.divIcon({
  className: "",
  html: `
    <div class="plane-marker">
      ${planeSVG}
    </div>
  `,
  iconSize: [50, 50],
  iconAnchor: [25, 25]
});

const planeMarker = L.marker([40.1281, 32.9951], {
  icon: aircraftIcon,
  zIndexOffset: 1100,
  interactive: false
}).addTo(map);

function movePlane(lat, lon) {
  planeMarker.setLatLng([lat, lon]);
}

function updateMapStatus(text) {
  document.getElementById("map-status").textContent = text;
}

function visibleAirports(level) {
  return AIRPORTS.filter((airport) => {
    if (level === 1) {
      return airport.region === "Turkey";
    }

    if (level === 2) {
      return airport.region === "Turkey" || airport.region === "Europe";
    }

    return true;
  });
}

function drawAirports(level) {
  airportLayer.clearLayers();

  const visible = visibleAirports(level);

  visible.forEach((airport) => {
    const marker = L.marker(
      [airport.lat, airport.lon],
      {
        icon: createAirportIcon(airport, level),
        keyboard: true
      }
    ).addTo(airportLayer);

    marker.bindTooltip(
      `${airport.city} (${airport.id}) · ${airport.country}`,
      {
        direction: "top",
        sticky: false
      }
    );

    marker.on("click", function () {
      selectFlight(airport);
    });
  });

  const bounds = L.latLngBounds(
    visible.map((airport) => [airport.lat, airport.lon])
  );

  map.invalidateSize({ pan: false });

  if (bounds.isValid()) {
    map.fitBounds(bounds.pad(0.12), {
      animate: false,
      maxZoom: level === 1 ? 7 : 5.7
    });
  }

  requestAnimationFrame(function () {
    map.invalidateSize({ pan: false });
  });

  setTimeout(function () {
    map.invalidateSize({ pan: false });
  }, 350);
}

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

window.addEventListener("resize", function () {
  map.invalidateSize({ pan: false });
});

console.log("AYSSKY CARGO map ready.");