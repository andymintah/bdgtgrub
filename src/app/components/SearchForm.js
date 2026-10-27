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

  const validatePostcode = (postcode) => {
    const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i;
    return ukPostcodeRegex.test(postcode.trim());
  };

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
    
    if (!validatePostcode(postcode)) {
      setPostcodeError('Please enter a valid UK postcode');
      return;
    }

    if (!budgetMax || parseFloat(budgetMax) <= 0) {
      alert('Please enter a valid budget');
      return;
    }

    if (selectedMeals.length === 0) {
      alert('Please select at least one meal option');
      return;
    }

    onSearch({
      postcode: postcode.trim(),
      budgetMin: budgetMin ? parseFloat(budgetMin) : 0,
      budgetMax: parseFloat(budgetMax),
      mealOptions: selectedMeals
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <form onSubmit={handleSubmit} className="space-y-6">
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Meal Options */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
            <Utensils className="w-4 h-4 mr-2" />
            Meal Options
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
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