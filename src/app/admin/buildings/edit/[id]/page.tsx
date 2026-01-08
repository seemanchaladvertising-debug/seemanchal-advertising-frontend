'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import BuildingForm from '@/components/admin/BuildingForm';
import withAuth from '@/components/admin/withAuth';

interface Building {
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
  isAvailable: boolean;
  seoMetaTitle: string;
  seoMetaDescription: string;
  images?: any[];
}

const EditBuildingPage = () => {
  const params = useParams();
  const { id } = params;
  const [building, setBuilding] = useState<Building | null>(null);

  useEffect(() => {
    if (id) {
      const fetchBuilding = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/buildings/${id}`);
        const data = await res.json();
        setBuilding(data);
      };
      fetchBuilding();
    }
  }, [id]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Building</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        {building ? <BuildingForm building={building} id={id as string} /> : <p>Loading...</p>}
      </div>
    </div>
  );
};

export default withAuth(EditBuildingPage);
