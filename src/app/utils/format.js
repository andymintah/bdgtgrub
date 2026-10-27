import { MEAL_OPTIONS } from './mealOptions';

const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

// £12 rather than £12.00 for whole amounts, so budgets read naturally.
export const formatPrice = (price) =>
  Number.isInteger(price) ? `£${price}` : gbp.format(price);

export const mealLabels = (values = []) =>
  values
    .map((value) => MEAL_OPTIONS.find((option) => option.value === value)?.label ?? value)
    .join(', ');

export const budgetPhrase = ({ budgetMin, budgetMax } = {}) =>
  budgetMin > 0
    ? `between ${formatPrice(budgetMin)} and ${formatPrice(budgetMax)}`
    : `up to ${formatPrice(budgetMax)}`;
