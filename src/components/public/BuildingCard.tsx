import Link from 'next/link';
import { FiMapPin } from 'react-icons/fi';

interface Building {
  id: string;
  title: string;
  locationName: string;
  pincode: string;
  hoardingSize?: string;
  images: { url: string }[];
  isAvailable: boolean;
}

const BuildingCard = ({ building }: { building: Building }) => {
  return (
    <Link href={`/buildings/${building.id}`} className="group block bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
      <div className="relative h-64 w-full overflow-hidden">
        <img 
          src={building.images[0]?.url || 'https://via.placeholder.com/400x300'} 
          alt={building.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className={`absolute top-4 right-4 px-3 py-1 text-sm font-semibold text-white rounded-full ${building.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}>
          {building.isAvailable ? 'Available' : 'Occupied'}
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-xl font-bold mb-2 truncate">{building.title}</h3>
            <div className="flex items-center text-gray-600">
              <FiMapPin className="mr-2" />
              <p className="truncate">{building.locationName}</p>
            </div>
            <p className="text-sm text-gray-500 mt-1 truncate">PIN: {building.pincode}</p>
          </div>

          {building.hoardingSize ? (
            <div className="shrink-0 text-right">
              <p className="text-[11px] uppercase tracking-wide text-gray-400">Hoarding Size</p>
              <p className="text-sm font-semibold text-gray-700">{building.hoardingSize}</p>
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
};

export default BuildingCard;
