import { BoxStack } from './Logo';
import { budgetPhrase, mealLabels } from '../utils/format';

export default function EmptyState({ searchParams }) {
  return (
    <section className="bg-box rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:items-center">
      <BoxStack mood="sad" className="w-24 h-auto shrink-0 rotate-6" />
      <div>
        <h2 className="font-display text-3xl leading-tight">
          Nothing {budgetPhrase(searchParams)} near {searchParams?.postcode}
        </h2>
        <p className="font-semibold mt-1">Matching {mealLabels(searchParams?.mealOptions)}</p>
        <p className="mt-3 max-w-[62ch]">
          Raise your maximum, lower or clear the amount to ignore, or pick more options above.
        </p>
      </div>
    </section>
  );
}
