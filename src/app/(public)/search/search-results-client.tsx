'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
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

const SearchResultsClient = () => {
  const searchParams = useSearchParams();
  const q = searchParams.get('q');
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchResults = async () => {
      if (!q) {
        setBuildings([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!baseUrl) throw new Error('Missing NEXT_PUBLIC_API_URL');
        const params = new URLSearchParams({ pincode: q, location: q });

        if (navigator.geolocation) {
          try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
            });
            params.set('lat', String(position.coords.latitude));
            params.set('lng', String(position.coords.longitude));
          } catch {
            // ignore geolocation errors and fall back to non-location search
          }
        }

        const res = await fetch(`${baseUrl}/buildings/search?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch results');

        const data: unknown = await res.json();
        const nextBuildings = Array.isArray(data) ? (data as Building[]) : [];
        if (!cancelled) setBuildings(nextBuildings);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Something went wrong';
        if (!cancelled) setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchResults();

    return () => {
      cancelled = true;
    };
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

export default SearchResultsClient;
