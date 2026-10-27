import { useState } from 'react';
import { MEAL_OPTIONS } from '../utils/mealOptions';
import { formatPrice } from '../utils/format';

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
      errors.budgetMax = 'Enter the most you want to spend, like 12';
    } else if (min > max) {
      errors.budgetMin = "The amount to ignore can't be more than your maximum";
    }

    if (selectedMeals.length === 0) {
      errors.meals = 'Pick at least one option';
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
      setPostcodeError('Enter a full UK postcode, like SW1A 1AA');
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
      setPostcodeError('Enter a full UK postcode, like SW1A 1AA');
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

  const maxForLabel = parseFloat(budgetMax);
  const submitLabel = loading
    ? 'Finding meals…'
    : maxForLabel > 0
      ? `Find meals up to ${formatPrice(maxForLabel)}`
      : 'Find meals';

  const sentenceErrors = [
    postcodeError && { id: 'postcode-error', text: postcodeError },
    fieldErrors.budgetMax && { id: 'budget-max-error', text: fieldErrors.budgetMax },
  ].filter(Boolean);

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-plate rounded-2xl p-6 sm:p-10 mb-12">
      <p className="type-expanded font-extrabold text-3xl sm:text-5xl leading-[1.35] sm:leading-[1.3]">
        Food near{' '}
        <label htmlFor="postcode" className="sr-only">UK postcode</label>
        <input
          id="postcode"
          type="text"
          value={postcode}
          onChange={handlePostcodeChange}
          placeholder="SW1A 1AA"
          autoComplete="postal-code"
          autoCapitalize="characters"
          spellCheck={false}
          size={8}
          aria-invalid={postcodeError ? 'true' : undefined}
          aria-describedby={postcodeError ? 'postcode-error' : undefined}
          className="sentence-input w-[8.4ch] uppercase"
          required
        />{' '}
        for up to{' '}
        <span className="whitespace-nowrap">
          £
          <label htmlFor="budget-max" className="sr-only">Most you want to spend, in pounds</label>
          <input
            id="budget-max"
            type="number"
            inputMode="decimal"
            value={budgetMax}
            onChange={(e) => setBudgetMax(e.target.value)}
            placeholder="12"
            min="0"
            step="0.50"
            aria-invalid={fieldErrors.budgetMax ? 'true' : undefined}
            aria-describedby={fieldErrors.budgetMax ? 'budget-max-error' : undefined}
            className="sentence-input w-[3.4ch]"
            required
          />
        </span>
      </p>

      {sentenceErrors.length > 0 && (
        <div className="mt-3 space-y-1">
          {sentenceErrors.map(({ id, text }) => (
            <p key={id} id={id} role="alert" className="text-reduced font-medium">
              {text}
            </p>
          ))}
        </div>
      )}

      <div className="mt-5 text-lg text-steam">
        <label htmlFor="budget-min">Ignore anything under </label>
        <span className="whitespace-nowrap">
          £
          <input
            id="budget-min"
            type="number"
            inputMode="decimal"
            value={budgetMin}
            onChange={(e) => setBudgetMin(e.target.value)}
            placeholder="0"
            min="0"
            step="0.50"
            aria-invalid={fieldErrors.budgetMin ? 'true' : undefined}
            aria-describedby={fieldErrors.budgetMin ? 'budget-min-error' : undefined}
            className="sentence-input w-[4ch] text-ink font-semibold border-b-2"
          />
          <span> (optional)</span>
        </span>
        {fieldErrors.budgetMin && (
          <p id="budget-min-error" role="alert" className="text-reduced font-medium mt-1">
            {fieldErrors.budgetMin}
          </p>
        )}
      </div>

      <fieldset
        className="mt-8"
        aria-describedby={fieldErrors.meals ? 'meals-error' : undefined}
      >
        <legend className="text-lg font-semibold mb-3">What are you after?</legend>
        <div className="flex flex-wrap gap-2">
          {MEAL_OPTIONS.map((option) => {
            const selected = selectedMeals.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={selected}
                onClick={() => handleMealToggle(option.value)}
                className={`px-4 py-2 rounded-full border-2 font-medium transition-colors ${
                  selected
                    ? 'bg-sticker border-ink text-ink'
                    : 'bg-plate border-ink/20 text-ink hover:border-ink/60'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        {fieldErrors.meals && (
          <p id="meals-error" role="alert" className="text-reduced font-medium mt-2">
            {fieldErrors.meals}
          </p>
        )}
      </fieldset>

      <button
        type="submit"
        disabled={loading || !!postcodeError}
        className="mt-10 w-full sm:w-auto bg-ink text-plate py-4 px-8 rounded-xl type-expanded font-bold text-lg hover:bg-ink/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {submitLabel}
      </button>
    </form>
  );
}
