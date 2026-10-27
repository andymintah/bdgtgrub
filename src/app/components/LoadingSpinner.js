import { budgetPhrase } from '../utils/format';

export default function LoadingSpinner({ searchParams }) {
  return (
    <div role="status" className="flex items-center gap-4 py-10">
      <div
        className="h-8 w-8 rounded-full border-4 border-ink/15 border-t-ink motion-safe:animate-spin"
        aria-hidden="true"
      />
      <p className="text-lg font-medium">
        {searchParams
          ? `Checking what's ${budgetPhrase(searchParams)} near ${searchParams.postcode}…`
          : 'Finding meals…'}
      </p>
    </div>
  );
}
