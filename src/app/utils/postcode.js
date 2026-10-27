const UK_POSTCODE_REGEX = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i;
const POSTCODES_IO_BASE = 'https://api.postcodes.io/postcodes';
const LOOKUP_TIMEOUT_MS = 5000;

/**
 * Checks a postcode against postcodes.io.
 * Resolves to one of: 'valid', 'invalid_format', 'not_found', 'unavailable'.
 */
export async function validatePostcode(postcode) {
  if (typeof postcode !== 'string') {
    return 'invalid_format';
  }

  const normalised = postcode.trim().toUpperCase();
  if (!UK_POSTCODE_REGEX.test(normalised)) {
    return 'invalid_format';
  }

  try {
    const response = await fetch(
      `${POSTCODES_IO_BASE}/${encodeURIComponent(normalised)}/validate`,
      { signal: AbortSignal.timeout(LOOKUP_TIMEOUT_MS), cache: 'no-store' }
    );

    if (response.status !== 200) {
      console.error('Postcode lookup failed: unexpected status', response.status);
      return 'unavailable';
    }

    const data = await response.json();
    if (data?.result === true) return 'valid';
    if (data?.result === false) return 'not_found';

    console.error('Postcode lookup failed: unexpected response body');
    return 'unavailable';
  } catch (error) {
    console.error('Postcode lookup failed:', error?.name || 'Error');
    return 'unavailable';
  }
}
