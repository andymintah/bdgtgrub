import { Star, Clock, MapPin, ExternalLink } from 'lucide-react';

export default function RecommendationList({ recommendations, searchParams }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(price);
  };

  const getPlatformColor = (platform) => {
    const colors = {
      'deliveroo': 'bg-teal-100 text-teal-800',
      'just-eat': 'bg-orange-100 text-orange-800',
      'uber-eats': 'bg-black text-white',
      'local': 'bg-purple-100 text-purple-800'
    };
    return colors[platform.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Found {recommendations.length} recommendations for {searchParams?.postcode}
        </h2>
        <p className="text-gray-600">
          Budget: {formatPrice(searchParams?.budgetMin || 0)} - {formatPrice(searchParams?.budgetMax)} • 
          Categories: {searchParams?.mealOptions.join(', ')}
        </p>
      </div>

      <div className="grid gap-6">
        {recommendations.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {item.dishName}
                  </h3>
                  <p className="text-gray-600 font-medium">{item.restaurantName}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">
                    {formatPrice(item.price)}
                  </div>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <div className="text-sm text-gray-500 line-through">
                      {formatPrice(item.originalPrice)}
                    </div>
                  )}
                </div>
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">
                {item.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                {item.rating && (
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">{item.rating}</span>
                    {item.reviewCount && (
                      <span className="ml-1">({item.reviewCount} reviews)</span>
                    )}
                  </div>
                )}
                
                {item.deliveryTime && (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{item.deliveryTime} mins</span>
                  </div>
                )}
                
                {typeof item.distance === 'number' && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{item.distance} miles</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex flex-wrap gap-2">
                  {item.platforms?.map((platform, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getPlatformColor(platform)}`}
                    >
                      {platform}
                    </span>
                  ))}
                  
                  {item.categories?.map((category, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                    >
                      {category}
                    </span>
                  ))}
                </div>

                {item.orderUrl && (
                  <a
                    href={item.orderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                  >
                    Order Now
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                )}
              </div>

              {item.specialOffer && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm font-medium">
                    🎉 Special Offer: {item.specialOffer}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}