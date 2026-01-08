import { Metadata } from 'next';
import BuildingDetails from '@/components/public/BuildingDetails';

// This is a Server Component

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
  seoMetaTitle?: string;
  seoMetaDescription?: string;
}

async function getBuilding(id: string): Promise<Building | null> {
  try {
    const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const trimmed = raw.replace(/\/+$/, '');
    const apiBase = trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;

    const res = await fetch(`${apiBase}/buildings/${id}`, { cache: 'no-store' });
    if (!res.ok) {
      console.error(`Error fetching building ${id}: ${res.statusText}`);
      return null;
    }
    return res.json();
  } catch (error) {
    console.error(`Failed to fetch building ${id}:`, error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const building = await getBuilding(params.id);

  if (!building) {
    return {
      title: 'Building Not Found',
      description: 'The requested building could not be found.',
    };
  }

  return {
    title: building.seoMetaTitle || building.title,
    description: building.seoMetaDescription || building.description?.substring(0, 160) || '',
  };
}

const BuildingDetailPage = async ({ params }: { params: { id: string } }) => {
  const building = await getBuilding(params.id);

  return <BuildingDetails building={building} />;
};

export default BuildingDetailPage;
