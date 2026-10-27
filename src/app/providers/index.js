// Server-only: never import this module from client components.
// Real providers will hold API keys.
import { mockProvider } from './mock';

/**
 * Search query passed to every provider.
 *
 * @typedef {Object} ProviderQuery
 * @property {string} postcode
 * @property {number|null} latitude   postcodes.io latitude, or null if the postcode has no location.
 * @property {number|null} longitude  postcodes.io longitude, or null if the postcode has no location.
 * @property {number} budgetMin
 * @property {number} budgetMax
 * @property {string[]} mealOptions
 */

/**
 * Provider contract. searchDishes resolves to an array of results in the
 * shared shape (see DishResult / toResult in ./shape.js).
 *
 * @typedef {Object} Provider
 * @property {string} id
 * @property {string} name
 * @property {(query: ProviderQuery) => Promise<import('./shape').DishResult[]>} searchDishes
 */

/**
 * The provider registry. This is the only place providers are listed:
 * to add one, import it above and add it to this array.
 *
 * @type {Provider[]}
 */
export const providers = [mockProvider];

/**
 * Thrown when every registered provider failed.
 */
export class AllProvidersFailedError extends Error {
  constructor() {
    super('All delivery providers failed');
    this.name = 'AllProvidersFailedError';
  }
}

/**
 * Call every registered provider and concatenate their results in registry
 * order. A provider that throws or rejects is logged and skipped. Throws
 * AllProvidersFailedError if every provider fails.
 *
 * @param {ProviderQuery} query
 * @returns {Promise<import('./shape').DishResult[]>}
 */
export async function searchProviders(query) {
  const settled = await Promise.allSettled(
    // Wrap in an async fn so a synchronous throw becomes a rejection
    providers.map(async provider => provider.searchDishes(query))
  );

  const results = [];
  let failures = 0;
  settled.forEach((outcome, i) => {
    if (outcome.status === 'fulfilled') {
      results.push(...(Array.isArray(outcome.value) ? outcome.value : []));
    } else {
      failures += 1;
      const error = outcome.reason;
      console.error(
        `Provider "${providers[i].id}" failed:`,
        error?.name ?? 'Error',
        error?.message ?? String(error)
      );
    }
  });

  if (providers.length > 0 && failures === providers.length) {
    throw new AllProvidersFailedError();
  }
  return results;
}
