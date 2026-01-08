'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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

interface SectionContent {
  enabled: boolean;
  title: string;
}

const FeaturedBuildings = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [content, setContent] = useState<SectionContent | null>(null);
  const [loading, setLoading] = useState(true);

  const apiBase = (() => {
    const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const trimmed = raw.replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  })();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${apiBase}/site-content/homepage`);
        if (res.ok) {
          const data = await res.json();
          setContent(data.sections.featuredLocations);
        }
      } catch (error) {
        console.error('Failed to fetch section content', error);
      }
    };

    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${apiBase}/buildings?limit=3`);
        if (res.ok) {
          const data = await res.json();
          setBuildings(data);
        }
      } catch (error) {
        console.error('Failed to fetch featured buildings', error);
      }
    };

    Promise.all([fetchContent(), fetchFeatured()]).finally(() => setLoading(false));
  }, [apiBase]);

  if (!content?.enabled || buildings.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">{content.title}</h2>
        </div>
        {loading ? (
          <p className="text-center">Loading featured locations...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {buildings.map((building) => (
              <BuildingCard key={building.id} building={building} />
            ))}
          </div>
        )}
        <div className="text-center mt-12">
          <Link href="/search">
            <div className="inline-block bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors">
              View All Locations
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBuildings;
