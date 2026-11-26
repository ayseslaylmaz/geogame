function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => deg * Math.PI / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function calculateFlight(origin, destination) {
  const distance = Math.round(
    calculateDistance(
      origin.lat,
      origin.lon,
      destination.lat,
      destination.lon
    )
  );

  return {
    distance,
    fuel: Math.max(1, Math.ceil(distance / 250)),
    coins: 1 + Math.ceil(distance / 700),
    time: 2 + Math.ceil(distance / 320)
  };
}

function shuffle(items) {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}