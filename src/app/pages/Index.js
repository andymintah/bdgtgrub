'use client';

import { useState } from 'react';
import SearchForm from '../components/SearchForm';
import RecommendationList from '../components/RecommendationList';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import Logo from '../components/Logo';
import Drip from '../components/Drip';

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
        let message = 'Failed to fetch recommendations';
        try {
          const errorBody = await response.json();
          if (typeof errorBody?.message === 'string' && errorBody.message) {
            message = errorBody.message;
          }
        } catch {
          // Non-JSON error body: keep the generic message
        }
        throw new Error(message);
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
    <main className="min-h-screen overflow-x-clip">
      <div className="shopfront bg-ketchup text-box">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-10">
          <header className="mb-10 sm:mb-14">
            <Logo />
            <h1 className="mt-3 text-lg font-semibold">Takeaway for when you&apos;re a bit skint</h1>
          </header>

          <SearchForm onSearch={handleSearch} loading={loading} />
        </div>
      </div>
      <Drip />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
        {error && <ErrorMessage message={error} />}

        {loading && <LoadingSpinner searchParams={searchParams} />}

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
    </main>
  );
}
