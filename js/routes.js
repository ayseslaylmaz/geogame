
/* SKY CARGO - ROUTE CALCULATIONS */

// Haversine distance calculation
function calculateDistance(lat1, lon1, lat2, lon2) {

    const R = 6371;

    const toRad = degrees => degrees * Math.PI / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
    );

    return R * c;
}

// Calculate flight details
function calculateFlight(fromAirport, toAirport) {

    const distance = calculateDistance(
        fromAirport.lat,
        fromAirport.lon,
        toAirport.lat,
        toAirport.lon
    );

    return {
        distance: Math.round(distance),
        fuel: Math.ceil(distance / 150),
        coins: 1 + Math.ceil(distance / 500),
        time: 2 + Math.ceil(distance / 100)
    };
}

console.log("Route calculations loaded.");
