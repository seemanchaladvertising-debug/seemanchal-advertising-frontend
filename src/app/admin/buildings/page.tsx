'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import withAuth from '@/components/admin/withAuth';

interface Building {
  id: string;
  title: string;
  locationName: string;
  pincode: string;
  hoardingSize?: string;
  isAvailable: boolean;
  images: { url: string }[];
}

const BuildingsPage = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);

  const apiBase = (() => {
    const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const trimmed = raw.replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  })();

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const res = await fetch(`${apiBase}/buildings`);
        const data = await res.json();
        setBuildings(data);
      } catch (error) {
        console.error('Failed to fetch buildings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBuildings();
  }, [apiBase]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this building?')) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`${apiBase}/buildings/${id}`, {
          method: 'DELETE',
          headers: { 'x-auth-token': token || '' },
        });
        setBuildings(buildings.filter((building) => building.id !== id));
      } catch (error) {
        console.error('Failed to delete building', error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Buildings</h1>
        <Link href="/admin/buildings/new" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
          Add New Building
        </Link>
      </div>
      {loading ? (
        <p>Loading buildings...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pincode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hoarding Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {buildings.map((building) => (
                <tr key={building.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={building.images[0]?.url || 'https://via.placeholder.com/150'} alt={building.title} className="w-16 h-16 object-cover rounded-md" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{building.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{building.locationName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{building.pincode}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{building.hoardingSize || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {building.isAvailable ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Available</span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Occupied</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/buildings/${building.id}`} target="_blank" className="text-indigo-600 hover:text-indigo-900 mr-4">View</Link>
                    <Link href={`/admin/buildings/edit/${building.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                    <button onClick={() => handleDelete(building.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default withAuth(BuildingsPage);
