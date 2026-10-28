import { Pail } from './Logo';
import { budgetPhrase } from '../utils/format';

export default function LoadingSpinner({ searchParams }) {
  return (
    <div role="status" className="flex flex-col sm:flex-row sm:items-end gap-4 py-8">
      <div className="flex gap-2" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <Pail key={i} className="box-bounce w-12 h-auto" style={{ animationDelay: `${i * 120}ms` }} />
        ))}
      </div>
      <p className="font-display text-2xl leading-tight">
        {searchParams
          ? `Checking menus ${budgetPhrase(searchParams)} near ${searchParams.postcode}…`
          : 'Checking menus…'}
      </p>
    </div>
  );
}
