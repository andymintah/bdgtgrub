import { budgetPhrase, mealLabels } from '../utils/format';

export default function EmptyState({ searchParams }) {
  return (
    <section className="bg-plate rounded-xl p-6 sm:p-8">
      <h2 className="type-expanded font-extrabold text-2xl">
        Nothing {budgetPhrase(searchParams)} near {searchParams?.postcode}
      </h2>
      <p className="text-steam mt-1">Matching {mealLabels(searchParams?.mealOptions)}</p>
      <p className="mt-4 max-w-[62ch]">
        Raise your maximum, lower or clear the amount to ignore, or pick more options above.
      </p>
    </section>
  );
}
