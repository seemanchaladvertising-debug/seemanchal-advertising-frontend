'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import withAuth from '@/components/admin/withAuth';

interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
  createdAt: any;
}

function normalizeEnquiriesResponse(data: any): Enquiry[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.enquiries)) return data.enquiries;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function formatEnquiryDate(createdAt: any): string {
  if (!createdAt) return '';

  const msFromSeconds = (seconds: unknown) => {
    const s = typeof seconds === 'number' ? seconds : Number(seconds);
    if (!Number.isFinite(s)) return null;
    return s * 1000;
  };

  const firestoreSeconds = msFromSeconds(createdAt?.seconds ?? createdAt?._seconds);
  const date = firestoreSeconds != null ? new Date(firestoreSeconds) : new Date(createdAt);

  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString();
}

const EnquiriesPage = () => {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const apiBase = (() => {
    const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const trimmed = raw.replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  })();

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        setError('');
        const token = localStorage.getItem('token');
        const res = await fetch(`${apiBase}/enquiries`, {
          headers: { 'x-auth-token': token || '' },
        });

        let data: any = null;
        try {
          data = await res.json();
        } catch {
          data = null;
        }

        if (!res.ok) {
          const msg = data?.msg || `Failed to fetch enquiries (${res.status})`;
          if (res.status === 401) {
            localStorage.removeItem('token');
            setError(msg);
            router.replace('/admin/login');
            return;
          }
          throw new Error(msg);
        }

        setEnquiries(normalizeEnquiriesResponse(data));
      } catch (error: any) {
        console.error('Failed to fetch enquiries', error);
        setError(error?.message || 'Failed to fetch enquiries');
        setEnquiries([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, []);

  const refreshEnquiries = async () => {
    try {
      setRefreshing(true);
      setError('');
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiBase}/enquiries`, {
        headers: { 'x-auth-token': token || '' },
        cache: 'no-store',
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        const msg = data?.msg || `Failed to fetch enquiries (${res.status})`;
        if (res.status === 401) {
          localStorage.removeItem('token');
          setError(msg);
          router.replace('/admin/login');
          return;
        }
        throw new Error(msg);
      }

      setEnquiries(normalizeEnquiriesResponse(data));
    } catch (error: any) {
      setError(error?.message || 'Failed to fetch enquiries');
    } finally {
      setRefreshing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`${apiBase}/enquiries/${id}`, {
          method: 'DELETE',
          headers: { 'x-auth-token': token || '' },
        });
        await refreshEnquiries();
      } catch (error) {
        console.error('Failed to delete enquiry', error);
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Enquiries</h1>
        <button
          onClick={refreshEnquiries}
          disabled={refreshing}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
        >
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      {error ? <p className="mb-4 text-red-600">{error}</p> : null}
      {loading ? (
        <p>Loading enquiries...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enquiries.map((enquiry) => (
                <tr key={enquiry.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{formatEnquiryDate(enquiry.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{enquiry.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{enquiry.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{enquiry.email || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{enquiry.subject || '-'}</td>
                  <td className="px-6 py-4 whitespace-normal max-w-sm">{enquiry.message || enquiry.subject || ''}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleDelete(enquiry.id)} className="text-red-600 hover:text-red-900">Delete</button>
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

export default withAuth(EnquiriesPage);
