'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/components/admin/withAuth';

const SettingsPage = () => {
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const apiBase = (() => {
    const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const trimmed = raw.replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  })();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${apiBase}/site-content/settings`);
        if (res.ok) {
          const data = await res.json();
          setWhatsappNumber(data.whatsappNumber || '');
          setSeoTitle(data.seoTitle || '');
          setSeoDescription(data.seoDescription || '');
        }
      } catch (error) {
        console.error('Failed to fetch settings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await fetch(`${apiBase}/site-content/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || '',
        },
        body: JSON.stringify({ whatsappNumber, seoTitle, seoDescription }),
      });
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings', error);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Site Settings</h1>
      {loading ? (
        <p>Loading settings...</p>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">WhatsApp Number</label>
            <input 
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="+91..."
            />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Default SEO</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Default Meta Title</label>
                <input 
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Default Meta Description</label>
                <textarea 
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      )}
    </div>
  );
};

export default withAuth(SettingsPage);
