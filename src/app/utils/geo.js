const EARTH_RADIUS_MILES = 3958.8;

const toRadians = degrees => (degrees * Math.PI) / 180;

/**
 * Great-circle (haversine) distance in miles between two lat/lng points.
 */
export function haversineMiles(lat1, lon1, lat2, lon2) {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.min(1, Math.sqrt(a)));
}

export function isValidCoordinate(value) {
  return typeof value === 'number' && Number.isFinite(value);
}
