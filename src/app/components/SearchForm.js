import { useState } from 'react';
import { MapPin, PoundSterling, Utensils } from 'lucide-react';

const MEAL_OPTIONS = [
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

export default function SearchForm({ onSearch, loading }) {
  const [postcode, setPostcode] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [postcodeError, setPostcodeError] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const validatePostcode = (postcode) => {
    const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i;
    return ukPostcodeRegex.test(postcode.trim());
  };

  // Budget and meal checks. Empty or non-numeric min is treated as 0;
  // a negative min is also treated as 0 (clamped) rather than erroring.
  const getFieldErrors = () => {
    const errors = {};
    const max = parseFloat(budgetMax);
    const parsedMin = parseFloat(budgetMin);
    const min = Number.isNaN(parsedMin) ? 0 : Math.max(0, parsedMin);

    if (Number.isNaN(max) || max <= 0) {
      errors.budgetMax = 'Please enter a valid max budget';
    } else if (min > max) {
      errors.budgetMin = 'Min budget cannot be greater than max budget';
    }

    if (selectedMeals.length === 0) {
      errors.meals = 'Please select at least one meal option';
    }

    return errors;
  };

  // Errors are only shown after the first submit, and are re-derived from
  // the current values so they clear as soon as each field is fixed.
  const fieldErrors = submitAttempted ? getFieldErrors() : {};

  const handlePostcodeChange = (e) => {
    const value = e.target.value.toUpperCase();
    setPostcode(value);
    
    if (value && !validatePostcode(value)) {
      setPostcodeError('Please enter a valid UK postcode (e.g., SW1A 1AA)');
    } else {
      setPostcodeError('');
    }
  };

  const handleMealToggle = (mealValue) => {
    setSelectedMeals(prev => 
      prev.includes(mealValue) 
        ? prev.filter(m => m !== mealValue)
        : [...prev, mealValue]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitAttempted(true);

    const postcodeValid = validatePostcode(postcode);
    if (!postcodeValid) {
      setPostcodeError('Please enter a valid UK postcode');
    }

    const errors = getFieldErrors();
    if (!postcodeValid || Object.keys(errors).length > 0) {
      return;
    }

    const parsedMin = parseFloat(budgetMin);
    onSearch({
      postcode: postcode.trim(),
      budgetMin: Number.isNaN(parsedMin) ? 0 : Math.max(0, parsedMin),
      budgetMax: parseFloat(budgetMax),
      mealOptions: selectedMeals
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Postcode Input */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 mr-2" />
            UK Postcode
          </label>
          <input
            type="text"
            value={postcode}
            onChange={handlePostcodeChange}
            placeholder="e.g., SW1A 1AA"
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              postcodeError ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {postcodeError && (
            <p className="text-red-500 text-sm mt-1">{postcodeError}</p>
          )}
        </div>

        {/* Budget Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <PoundSterling className="w-4 h-4 mr-2" />
              Min Budget (optional)
            </label>
            <input
              type="number"
              value={budgetMin}
              onChange={(e) => setBudgetMin(e.target.value)}
              placeholder="0"
              min="0"
              step="0.50"
              aria-invalid={fieldErrors.budgetMin ? 'true' : undefined}
              aria-describedby={fieldErrors.budgetMin ? 'budget-min-error' : undefined}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                fieldErrors.budgetMin ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {fieldErrors.budgetMin && (
              <p id="budget-min-error" role="alert" className="text-red-500 text-sm mt-1">
                {fieldErrors.budgetMin}
              </p>
            )}
          </div>
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <PoundSterling className="w-4 h-4 mr-2" />
              Max Budget
            </label>
            <input
              type="number"
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
              placeholder="20"
              min="0"
              step="0.50"
              aria-invalid={fieldErrors.budgetMax ? 'true' : undefined}
              aria-describedby={fieldErrors.budgetMax ? 'budget-max-error' : undefined}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                fieldErrors.budgetMax ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {fieldErrors.budgetMax && (
              <p id="budget-max-error" role="alert" className="text-red-500 text-sm mt-1">
                {fieldErrors.budgetMax}
              </p>
            )}
          </div>
        </div>

        {/* Meal Options */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
            <Utensils className="w-4 h-4 mr-2" />
            Meal Options
          </label>
          <div
            role="group"
            aria-label="Meal options"
            aria-describedby={fieldErrors.meals ? 'meals-error' : undefined}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2"
          >
            {MEAL_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleMealToggle(option.value)}
                className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedMeals.includes(option.value)
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {fieldErrors.meals && (
            <p id="meals-error" role="alert" className="text-red-500 text-sm mt-1">
              {fieldErrors.meals}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !!postcodeError}
          className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Finding Recommendations...' : 'Find Food Options'}
        </button>
      </form>
    </div>
  );
}