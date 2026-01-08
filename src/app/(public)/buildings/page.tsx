'use client';

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

const BuildingsPage = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/buildings`);
        const data = await res.json();
        setBuildings(data);
      } catch (error) {
        console.error('Failed to fetch buildings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBuildings();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Our Locations</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {buildings.map((building) => (
            <BuildingCard key={building.id} building={building} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BuildingsPage;
