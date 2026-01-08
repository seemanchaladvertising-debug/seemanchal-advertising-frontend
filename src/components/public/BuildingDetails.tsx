'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ImageGallery from './ImageGallery';

interface Building {
  id: string;
  title: string;
  description: string;
  locationName: string;
  pincode: string;
  hoardingSize?: string;
  marketPrice?: number | null;
  dealPrice?: number | null;
  discountPercent?: number | null;
  facingDirection?: string;
  hoardingCode?: string;
  lightType?: string;
  dailyTraffic?: string;
  agencyName?: string;
  lat: number;
  lng: number;
  images: { url: string }[];
  isAvailable: boolean;
}

const BuildingDetails = ({ building }: { building: Building | null }) => {
  const [similarBuildings, setSimilarBuildings] = useState<Building[]>([]);

  if (!building) {
    return <p className="text-center text-red-500">Building not found.</p>;
  }

  const apiBase = (() => {
    const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const trimmed = raw.replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  })();

  const formatINR = (value: number | null | undefined) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return '-';
    return `₹ ${Number(value).toLocaleString('en-IN')}`;
  };

  const discount = (() => {
    if (building.discountPercent !== null && building.discountPercent !== undefined) return building.discountPercent;
    const mp = building.marketPrice;
    const dp = building.dealPrice;
    if (mp && dp && mp > 0) return Math.round(((mp - dp) / mp) * 100);
    return null;
  })();

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const res = await fetch(`${apiBase}/buildings?limit=12`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data)) return;

        const normalized = data as Building[];
        const filtered = normalized
          .filter((b) => b?.id && b.id !== building.id)
          .filter((b) => b.pincode === building.pincode || b.locationName === building.locationName)
          .slice(0, 6);

        setSimilarBuildings(filtered);
      } catch {
        setSimilarBuildings([]);
      }
    };

    fetchSimilar();
  }, [apiBase, building.id, building.locationName, building.pincode]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          {building.images && building.images.length > 0 ? (
            <ImageGallery images={building.images} />
          ) : (
            <div className="w-full rounded-lg bg-gray-100 aspect-[1280/820]" />
          )}
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white rounded-lg shadow-md p-5">
            <h1 className="text-xl font-bold text-gray-900">{building.title}</h1>
            <p className="text-sm text-gray-600 mt-1">
              {building.locationName}{building.pincode ? `, ${building.pincode}` : ''}
            </p>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Market Price</span>
                <span className="font-semibold text-gray-900">{formatINR(building.marketPrice)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Deal Price</span>
                <span className="font-semibold text-gray-900">{formatINR(building.dealPrice)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">You Save</span>
                <span className="font-semibold text-green-700">{discount === null ? '-' : `${discount}%`}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Availability</span>
                <span className={`font-semibold ${building.isAvailable ? 'text-green-700' : 'text-red-700'}`}>
                  {building.isAvailable ? 'Available' : 'Occupied'}
                </span>
              </div>
            </div>

            <div className="mt-5">
              <Link
                href="/contact"
                className="inline-flex w-full items-center justify-center rounded-md bg-green-700 px-4 py-2 text-white font-semibold hover:bg-green-800"
              >
                ENQUIRY
              </Link>
            </div>
          </div>

          {similarBuildings.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md p-5 mt-6">
              <h2 className="text-sm font-bold text-gray-900 mb-4">Similar Hoardings</h2>
              <div className="space-y-3">
                {similarBuildings.map((b) => (
                  <Link key={b.id} href={`/buildings/${b.id}`} className="flex gap-3 group">
                    <div className="w-20 h-14 rounded-md overflow-hidden bg-gray-100 shrink-0">
                      <img
                        src={b.images?.[0]?.url || 'https://via.placeholder.com/160x120'}
                        alt={b.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{b.title}</p>
                      <p className="text-xs text-gray-600 truncate">{b.locationName}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-10 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="border-b md:border-b-0 md:border-r border-gray-200">
            <div className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-700">Hoarding Detail</div>
            <div className="px-6 pb-6">
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <span className="text-gray-500">Hoarding Name</span>
                <span className="text-gray-900 font-medium">{building.title}</span>

                <span className="text-gray-500">Size (W × H)</span>
                <span className="text-gray-900 font-medium">{building.hoardingSize || '-'}</span>

                <span className="text-gray-500">Facing Direction</span>
                <span className="text-gray-900 font-medium">{building.facingDirection || '-'}</span>

                <span className="text-gray-500">Hoarding Code</span>
                <span className="text-gray-900 font-medium">{building.hoardingCode || '-'}</span>

                <span className="text-gray-500">Market Price</span>
                <span className="text-gray-900 font-medium">{formatINR(building.marketPrice)}</span>

                <span className="text-gray-500">Deal Price</span>
                <span className="text-gray-900 font-medium">{formatINR(building.dealPrice)}</span>

                <span className="text-gray-500">Light Type</span>
                <span className="text-gray-900 font-medium">{building.lightType || '-'}</span>

                <span className="text-gray-500">Daily Traffic</span>
                <span className="text-gray-900 font-medium">{building.dailyTraffic || '-'}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-700">Agency Name</div>
            <div className="px-6 pb-6">
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <span className="text-gray-500">Agency</span>
                <span className="text-gray-900 font-medium">{building.agencyName || '-'}</span>

                <span className="text-gray-500">Location</span>
                <span className="text-gray-900 font-medium">{building.locationName || '-'}</span>

                <span className="text-gray-500">PIN</span>
                <span className="text-gray-900 font-medium">{building.pincode || '-'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {building.description ? (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-3">Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{building.description}</p>
        </div>
      ) : null}
    </div>
  );
};

export default BuildingDetails;
