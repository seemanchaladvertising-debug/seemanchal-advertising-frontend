'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import BuildingCard from '@/components/public/BuildingCard';

interface Building {
  id: string;
  title: string;
  locationName: string;
  pincode: string;
  hoardingSize?: string;
  images: { url: string }[];
  isAvailable: boolean;
}

const SearchResultsPage = () => {
  const searchParams = useSearchParams();
  const q = searchParams.get('q');
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!q) {
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError('');
      try {
        // Attempt to get user's location for proximity fallback
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/buildings/search?pincode=${q}&location=${q}&lat=${latitude}&lng=${longitude}`);
          if (!res.ok) throw new Error('Failed to fetch results');
          const data = await res.json();
          setBuildings(data);
        }, async (err) => {
          // Geolocation failed, search without it
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/buildings/search?pincode=${q}&location=${q}`);
          if (!res.ok) throw new Error('Failed to fetch results');
          const data = await res.json();
          setBuildings(data);
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [q]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Results for "{q}"</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && buildings.length === 0 && <p>No buildings found for your search.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {buildings.map((building) => (
          <BuildingCard key={building.id} building={building} />
        ))}
      </div>
    </div>
  );
};

export default SearchResultsPage;
