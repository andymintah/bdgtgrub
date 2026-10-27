// Allowed meal options. Shared by the search form (client) and the
// recommendations API validator (server) so the two lists can't drift.
// Keep this module free of any server-only or client-only imports.
export const MEAL_OPTIONS = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snacks', label: 'Snacks' },
  { value: 'dessert', label: 'Dessert' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten-free', label: 'Gluten-Free' },
  { value: 'halal', label: 'Halal' },
  { value: 'kosher', label: 'Kosher' }
];

export const MEAL_OPTION_VALUES = MEAL_OPTIONS.map(option => option.value);
