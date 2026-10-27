/**
 * Shared result shape returned by every delivery provider.
 *
 * @typedef {Object} DishResult
 * @property {string} restaurantName
 * @property {string} dishName
 * @property {string} description
 * @property {number} price          Price in GBP.
 * @property {number} rating
 * @property {number} reviewCount
 * @property {number} deliveryTime   Minutes.
 * @property {number|null} distance  Miles from the searched postcode, rounded to 1 dp, or null.
 * @property {string[]} platforms
 * @property {string[]} categories
 * @property {string} orderUrl
 * @property {number|null} originalPrice
 * @property {string|null} specialOffer
 */

export const RESULT_FIELDS = [
  'restaurantName',
  'dishName',
  'description',
  'price',
  'rating',
  'reviewCount',
  'deliveryTime',
  'distance',
  'platforms',
  'categories',
  'orderUrl',
  'originalPrice',
  'specialOffer',
];

/**
 * Build a new object with exactly the RESULT_FIELDS keys. Unknown keys
 * (for example latitude/longitude) are dropped. Missing optional values
 * become null, and platforms/categories are always arrays.
 *
 * @param {Object} raw
 * @returns {DishResult}
 */
export function toResult(raw) {
  const result = {};
  for (const field of RESULT_FIELDS) {
    result[field] = raw[field] === undefined ? null : raw[field];
  }
  result.distance = typeof raw.distance === 'number' ? raw.distance : null;
  result.platforms = Array.isArray(raw.platforms) ? [...raw.platforms] : [];
  result.categories = Array.isArray(raw.categories) ? [...raw.categories] : [];
  return result;
}
