'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/components/admin/withAuth';

interface Link {
  label: string;
  url: string;
}

interface SocialLink {
  platform: string;
  url: string;
}

interface FooterContent {
  about: { text: string };
  quickLinks: Link[];
  contact: { address: string; email: string; phone: string };
  socialLinks: SocialLink[];
}

const FooterCMSPage = () => {
  const [content, setContent] = useState<FooterContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const apiBase = (() => {
    const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const trimmed = raw.replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  })();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${apiBase}/site-content/footer`, {
          headers: { 'x-auth-token': token || '' },
        });
        if (res.ok) {
          const data = await res.json();
          setContent(data);
        }
      } catch (error) {
        console.error('Failed to fetch footer content', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [apiBase]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, section: keyof FooterContent, field: string, index?: number) => {
    if (!content) return;
    const newContent = JSON.parse(JSON.stringify(content));
    const { name, value } = e.target;

    if (index !== undefined) {
      (newContent[section] as any)[index][name] = value;
    } else {
      (newContent[section] as any)[field] = value;
    }
    setContent(newContent);
  };

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await fetch(`${apiBase}/site-content/footer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || '',
        },
        body: JSON.stringify(content),
      });
      alert('Footer content saved successfully!');
    } catch (error) {
      console.error('Failed to save footer content', error);
      alert('Failed to save footer content.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading footer content...</p>;
  if (!content) return <p>Could not load footer content.</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Footer</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">About Section</h2>
          <textarea 
            name="text"
            value={content.about.text}
            onChange={(e) => handleInputChange(e, 'about', 'text')}
            rows={5}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Contact Info</h2>
          <div className="space-y-4">
            <input type="text" name="address" value={content.contact.address} onChange={(e) => handleInputChange(e, 'contact', 'address')} placeholder="Address" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
            <input type="email" name="email" value={content.contact.email} onChange={(e) => handleInputChange(e, 'contact', 'email')} placeholder="Email" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
            <input type="tel" name="phone" value={content.contact.phone} onChange={(e) => handleInputChange(e, 'contact', 'phone')} placeholder="Phone" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Quick Links</h2>
          <div className="space-y-4">
            {content.quickLinks.map((link, index) => (
              <div key={index} className="flex gap-2">
                <input type="text" name="label" value={link.label} onChange={(e) => handleInputChange(e, 'quickLinks', '', index)} placeholder="Label" className="w-1/2 p-2 border border-gray-300 rounded-md" />
                <input type="text" name="url" value={link.url} onChange={(e) => handleInputChange(e, 'quickLinks', '', index)} placeholder="URL" className="w-1/2 p-2 border border-gray-300 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Social Media Links</h2>
          <div className="space-y-4">
            {content.socialLinks.map((link, index) => (
              <div key={index} className="flex gap-2">
                <input type="text" name="platform" value={link.platform} onChange={(e) => handleInputChange(e, 'socialLinks', '', index)} placeholder="Platform" className="w-1/2 p-2 border border-gray-300 rounded-md" />
                <input type="text" name="url" value={link.url} onChange={(e) => handleInputChange(e, 'socialLinks', '', index)} placeholder="URL" className="w-1/2 p-2 border border-gray-300 rounded-md" />
              </div>
            ))}
          </div>
        </div>

      </div>
      <button 
        onClick={handleSave}
        disabled={saving}
        className="mt-8 w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
      >
        {saving ? 'Saving...' : 'Save Footer Settings'}
      </button>
    </div>
  );
};

export default withAuth(FooterCMSPage);
