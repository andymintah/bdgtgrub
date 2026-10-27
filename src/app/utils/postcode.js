import { isValidCoordinate } from './geo';

const UK_POSTCODE_REGEX = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i;
const POSTCODES_IO_BASE = 'https://api.postcodes.io/postcodes';
const LOOKUP_TIMEOUT_MS = 5000;

/**
 * Looks up a postcode on postcodes.io.
 * Resolves to { status, latitude, longitude } where status is one of
 * 'valid', 'invalid_format', 'not_found', 'unavailable'. latitude/longitude
 * are finite numbers when status is 'valid' and postcodes.io knows the
 * location, otherwise null.
 */
export async function lookupPostcode(postcode) {
  const result = status => ({ status, latitude: null, longitude: null });

  if (typeof postcode !== 'string') {
    return result('invalid_format');
  }

  const normalised = postcode.trim().toUpperCase();
  if (!UK_POSTCODE_REGEX.test(normalised)) {
    return result('invalid_format');
  }

  try {
    const response = await fetch(
      `${POSTCODES_IO_BASE}/${encodeURIComponent(normalised)}`,
      { signal: AbortSignal.timeout(LOOKUP_TIMEOUT_MS), cache: 'no-store' }
    );

    if (response.status === 404) {
      return result('not_found');
    }

    if (response.status !== 200) {
      console.error('Postcode lookup failed: unexpected status', response.status);
      return result('unavailable');
    }

    const data = await response.json();
    const body = data?.result;
    if (!body || typeof body !== 'object') {
      console.error('Postcode lookup failed: unexpected response body');
      return result('unavailable');
    }

    // Some non-geographic postcodes have null coordinates; treat as valid
    // but without a location. Anything else that isn't a finite number is a
    // malformed body.
    const { latitude, longitude } = body;
    const isNullOrCoordinate = value => value === null || isValidCoordinate(value);
    if (!isNullOrCoordinate(latitude) || !isNullOrCoordinate(longitude)) {
      console.error('Postcode lookup failed: unexpected response body');
      return result('unavailable');
    }

    const hasLocation = isValidCoordinate(latitude) && isValidCoordinate(longitude);
    return {
      status: 'valid',
      latitude: hasLocation ? latitude : null,
      longitude: hasLocation ? longitude : null,
    };
  } catch (error) {
    console.error('Postcode lookup failed:', error?.name || 'Error');
    return result('unavailable');
  }
}
