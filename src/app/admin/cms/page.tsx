'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/components/admin/withAuth';

const CMSPage = () => {
  const [aboutContent, setAboutContent] = useState('');
  const [contactContent, setContactContent] = useState('');
  const [termsContent, setTermsContent] = useState('');
  const [privacyContent, setPrivacyContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/site-content/pages`);
        if (res.ok) {
          const data = await res.json();
          setAboutContent(data.aboutContent || '');
          setContactContent(data.contactContent || '');
          setTermsContent(data.termsContent || '');
          setPrivacyContent(data.privacyContent || '');
        }
      } catch (error) {
        console.error('Failed to fetch page content', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/site-content/pages`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || '',
        },
        body: JSON.stringify({ aboutContent, contactContent, termsContent, privacyContent }),
      });
      alert('Content saved successfully!');
    } catch (error) {
      console.error('Failed to save content', error);
      alert('Failed to save content.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Page Content</h1>
      {loading ? (
        <p>Loading content...</p>
      ) : (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">About Us Page</h2>
            <textarea 
              value={aboutContent}
              onChange={(e) => setAboutContent(e.target.value)}
              rows={10}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Contact Us Page</h2>
            <textarea 
              value={contactContent}
              onChange={(e) => setContactContent(e.target.value)}
              rows={10}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Terms &amp; Conditions Page</h2>
            <textarea
              value={termsContent}
              onChange={(e) => setTermsContent(e.target.value)}
              rows={10}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Privacy Policy Page</h2>
            <textarea
              value={privacyContent}
              onChange={(e) => setPrivacyContent(e.target.value)}
              rows={10}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      )}
    </div>
  );
};

export default withAuth(CMSPage);
