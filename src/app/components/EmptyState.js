import { SearchX } from 'lucide-react';

export default function EmptyState({ searchParams }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
      <SearchX className="w-12 h-12 text-orange-500 mx-auto mb-4" aria-hidden="true" />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        No meals found
      </h2>
      <p className="text-gray-600 mb-4">
        Budget: {formatPrice(searchParams?.budgetMin || 0)} - {formatPrice(searchParams?.budgetMax)} • 
        Categories: {searchParams?.mealOptions?.join(', ')}
      </p>
      <p className="text-gray-700">
        Try a higher maximum budget, a lower minimum budget, or choose different or more meal options.
      </p>
    </div>
  );
}
