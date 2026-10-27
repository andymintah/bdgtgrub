'use client';

import { useState } from 'react';
import SearchForm from '../components/SearchForm';
import RecommendationList from '../components/RecommendationList';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

export default function Home() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState(null);

  const handleSearch = async (formData) => {
    setLoading(true);
    setError(null);
    setSearchParams(formData);

    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🍽️ Food Delivery Finder
            </h1>
            <p className="text-lg text-gray-600">
              Discover delicious meals within your budget and location
            </p>
          </header>

          <div className="max-w-4xl mx-auto">
            <SearchForm onSearch={handleSearch} loading={loading} />
            
            {error && <ErrorMessage message={error} />}
            
            {loading && <LoadingSpinner />}
            
            {recommendations.length > 0 && !loading && (
              <RecommendationList 
                recommendations={recommendations} 
                searchParams={searchParams}
              />
            )}

            {searchParams && !loading && !error && recommendations.length === 0 && (
              <EmptyState searchParams={searchParams} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
