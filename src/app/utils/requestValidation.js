import { MEAL_OPTION_VALUES } from './mealOptions';

const POSTCODE_MAX_LENGTH = 10;
const BUDGET_MAX_LIMIT = 1000;
const MEAL_OPTIONS_MAX_COUNT = 10;

const fail = message => ({ ok: false, message });

const isFiniteNumber = value => typeof value === 'number' && Number.isFinite(value);

const isPlainObject = value =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

/**
 * Validates and normalises a POST /api/recommendations body.
 * Pure: no I/O. Returns { ok: true, value: { postcode, budgetMin, budgetMax,
 * mealOptions } } or { ok: false, message } for the first failing field
 * (checked in order postcode, budgetMax, budgetMin, mealOptions).
 * Messages are user-facing and never echo the raw input.
 */
export function validateRecommendationRequest(body) {
  if (!isPlainObject(body)) {
    return fail('Request body must be a JSON object.');
  }

  // postcode: string, 1-10 chars after trimming; normalised to upper case
  const { postcode: rawPostcode } = body;
  if (typeof rawPostcode !== 'string') {
    return fail('Postcode is required.');
  }
  const postcode = rawPostcode.trim().toUpperCase();
  if (postcode.length === 0) {
    return fail('Postcode is required.');
  }
  if (postcode.length > POSTCODE_MAX_LENGTH) {
    return fail('Please enter a valid UK postcode (for example SW1A 1AA).');
  }

  // budgetMax: finite JSON number, 0 < budgetMax <= 1000
  const { budgetMax } = body;
  if (!isFiniteNumber(budgetMax) || budgetMax <= 0) {
    return fail('Max budget must be a number greater than £0.');
  }
  if (budgetMax > BUDGET_MAX_LIMIT) {
    return fail(`Max budget can't be more than £${BUDGET_MAX_LIMIT}.`);
  }

  // budgetMin: optional (defaults to 0), finite JSON number, 0 <= min <= max
  const budgetMin = body.budgetMin === undefined ? 0 : body.budgetMin;
  if (!isFiniteNumber(budgetMin) || budgetMin < 0) {
    return fail('Min budget must be a number of £0 or more.');
  }
  if (budgetMin > budgetMax) {
    return fail("Min budget can't be more than max budget.");
  }

  // mealOptions: array of 1-10 known values; de-duplicated, order kept
  const { mealOptions: rawMealOptions } = body;
  if (!Array.isArray(rawMealOptions) || rawMealOptions.length === 0) {
    return fail('Please select at least one meal option.');
  }
  if (rawMealOptions.length > MEAL_OPTIONS_MAX_COUNT) {
    return fail(`Please select no more than ${MEAL_OPTIONS_MAX_COUNT} meal options.`);
  }
  if (!rawMealOptions.every(meal => typeof meal === 'string' && MEAL_OPTION_VALUES.includes(meal))) {
    return fail('Meal options contain an unknown value.');
  }
  const mealOptions = [...new Set(rawMealOptions)];

  return { ok: true, value: { postcode, budgetMin, budgetMax, mealOptions } };
}
