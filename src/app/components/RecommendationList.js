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

// Hand-cut shop-window star: 14 spikes in a 100 x 100 box.
const STAR_POINTS = Array.from({ length: 28 }, (_, i) => {
  const radius = i % 2 === 0 ? 50 : 41;
  const angle = (Math.PI * i) / 14 - Math.PI / 2;
  return `${(50 + radius * Math.cos(angle)).toFixed(1)},${(50 + radius * Math.sin(angle)).toFixed(1)}`;
}).join(' ');

const STARS = [
  { fill: 'var(--color-pink)', tilt: '8deg' },
  { fill: 'var(--color-lime)', tilt: '-7deg' },
];

function PriceStar({ item, index }) {
  const { fill, tilt } = STARS[index % STARS.length];
  const discounted = item.originalPrice && item.originalPrice > item.price;
  return (
    <div
      className="price-star absolute -top-5 -right-3 sm:-right-5 w-28 h-28 sm:w-32 sm:h-32 grid place-items-center text-center"
      style={{ '--tilt': tilt, animationDelay: `${index * 80}ms` }}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" aria-hidden="true">
        <polygon points={STAR_POINTS} fill={fill} stroke="var(--color-soy)" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
      <div className="relative leading-none">
        {discounted && (
          <p className="text-xs font-bold mb-0.5">
            was <s>{formatPrice(item.originalPrice)}</s>
          </p>
        )}
        <p className="font-display text-2xl">
          {discounted && <span className="sr-only">now </span>}
          {formatPrice(item.price)}
        </p>
      </div>
    </div>
  );
}

export default function RecommendationList({ recommendations, searchParams }) {
  const count = recommendations.length;

  return (
    <section aria-labelledby="results-heading">
      <h2 id="results-heading" className="font-display text-3xl sm:text-4xl leading-tight">
        {count} {count === 1 ? 'meal' : 'meals'} {budgetPhrase(searchParams)} near {searchParams?.postcode}
      </h2>
      <p className="font-semibold mt-1 mb-10">Matching {mealLabels(searchParams?.mealOptions)}</p>

      <ol className="space-y-8">
        {recommendations.map((item, index) => (
          <li key={index} className="relative bg-box rounded-3xl p-5 sm:p-7">
            <PriceStar item={item} index={index} />

            <div className="pr-24 sm:pr-32">
              <h3 className="font-display text-2xl leading-tight">{item.dishName}</h3>
              <p className="font-bold text-lg mt-1">{item.restaurantName}</p>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-soy/75">
              {item.rating && (
                <span className="inline-flex items-center gap-1">
                  <Star className="w-4 h-4 fill-mustard text-soy" aria-hidden="true" />
                  <span className="text-soy font-bold">{item.rating}</span>
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

            <p className="mt-3 max-w-[62ch] leading-relaxed">{item.description}</p>

            {item.specialOffer && (
              <p className="mt-3 inline-flex items-center gap-1.5 bg-lime/60 rounded-full px-3 py-1 font-bold text-sm">
                <Tag className="w-4 h-4" aria-hidden="true" />
                {item.specialOffer}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 mt-5">
              {item.platforms?.length > 0 && (
                <p className="text-sm text-soy/75">Available on {joinNames(item.platforms)}</p>
              )}
              {item.orderUrl && (
                <a
                  href={item.orderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ketchup text-box font-bold hover:bg-ketchup-dark transition-colors"
                >
                  {orderLabel(item.orderUrl, item.restaurantName)}
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
