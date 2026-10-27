import { mockRecommendations } from '../utils/MockData';
import { haversineMiles } from '../utils/geo';
import { toResult } from './shape';

/**
 * Mock provider backed by the hardcoded list in MockData.js.
 * Returns every item unfiltered; the route applies budget/meal filters.
 *
 * @type {import('./index').Provider}
 */
export const mockProvider = {
  id: 'mock',
  name: 'Mock data',
  async searchDishes({ latitude, longitude }) {
    return mockRecommendations.map(item =>
      // toResult builds a new object, so the shared mock data is never mutated
      toResult({
        ...item,
        distance: latitude === null || longitude === null
          ? null
          : Math.round(haversineMiles(latitude, longitude, item.latitude, item.longitude) * 10) / 10,
      })
    );
  },
};
