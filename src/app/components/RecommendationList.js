import { Star, Clock, MapPin, ExternalLink, Tag } from 'lucide-react';
import { formatPrice, mealLabels, budgetPhrase } from '../utils/format';

// Name the order link after the platform it opens. Anything else is the
// restaurant's own site.
const ORDER_HOSTS = [
  ['deliveroo', 'Deliveroo'],
  ['just-eat', 'Just Eat'],
  ['ubereats', 'Uber Eats'],
  ['uber', 'Uber Eats'],
];

const orderLabel = (url, restaurantName) => {
  let host = '';
  try {
    host = new URL(url).hostname;
  } catch {
    // Unparseable URL: fall through to the restaurant name
  }
  const match = ORDER_HOSTS.find(([key]) => host.includes(key));
  return match ? `Order on ${match[1]}` : `Order from ${restaurantName}`;
};

const joinNames = (names) =>
  names.length < 2 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`;

export default function RecommendationList({ recommendations, searchParams }) {
  const count = recommendations.length;

  return (
    <section aria-labelledby="results-heading">
      <h2 id="results-heading" className="type-expanded font-extrabold text-2xl sm:text-3xl">
        {count} {count === 1 ? 'meal' : 'meals'} {budgetPhrase(searchParams)} near {searchParams?.postcode}
      </h2>
      <p className="text-steam mt-1 mb-8">Matching {mealLabels(searchParams?.mealOptions)}</p>

      <ol className="space-y-3">
        {recommendations.map((item, index) => {
          const discounted = item.originalPrice && item.originalPrice > item.price;
          return (
            <li key={index} className="bg-plate rounded-xl p-5 sm:p-6 grid grid-cols-[1fr_auto] gap-x-4 sm:gap-x-8">
              <div className="min-w-0">
                <h3 className="type-expanded font-bold text-xl leading-tight">{item.dishName}</h3>
                <p className="font-semibold mt-1">{item.restaurantName}</p>

                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-steam">
                  {item.rating && (
                    <span className="inline-flex items-center gap-1">
                      <Star className="w-4 h-4 fill-ink text-ink" aria-hidden="true" />
                      <span className="text-ink font-medium">{item.rating}</span>
                      {item.reviewCount && <span>({item.reviewCount.toLocaleString('en-GB')} reviews)</span>}
                    </span>
                  )}
                  {item.deliveryTime && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-4 h-4" aria-hidden="true" />
                      {item.deliveryTime} min delivery
                    </span>
                  )}
                  {typeof item.distance === 'number' && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-4 h-4" aria-hidden="true" />
                      {item.distance} miles away
                    </span>
                  )}
                </div>
              </div>

              <div
                className="sticker self-start px-3 py-2 text-right"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                {discounted && (
                  <p className="text-reduced text-xs font-bold leading-none mb-1">
                    Reduced <s className="font-semibold">{formatPrice(item.originalPrice)}</s>
                  </p>
                )}
                <p className="type-expanded font-extrabold text-2xl sm:text-3xl leading-none">
                  {discounted && <span className="sr-only">Now </span>}
                  {formatPrice(item.price)}
                </p>
              </div>

              <div className="col-span-2 mt-3">
                <p className="max-w-[62ch] leading-relaxed">{item.description}</p>

                {item.specialOffer && (
                  <p className="mt-2 inline-flex items-center gap-1.5 font-semibold text-sm">
                    <Tag className="w-4 h-4" aria-hidden="true" />
                    {item.specialOffer}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                  {item.platforms?.length > 0 && (
                    <p className="text-sm text-steam">Available on {joinNames(item.platforms)}</p>
                  )}
                  {item.orderUrl && (
                    <a
                      href={item.orderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-ink font-semibold hover:bg-ink hover:text-plate transition-colors"
                    >
                      {orderLabel(item.orderUrl, item.restaurantName)}
                      <ExternalLink className="w-4 h-4" aria-hidden="true" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
