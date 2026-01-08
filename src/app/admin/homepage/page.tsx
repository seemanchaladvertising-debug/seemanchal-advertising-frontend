'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/components/admin/withAuth';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface HomepageContent {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage?: { url: string; filename?: string } | null;
    slider?: {
      enabled: boolean;
      intervalMs?: number;
      images: Array<{ url: string; filename?: string }>;
    };
  };
  sections: {
    featuredLocations: { enabled: boolean; title: string };
    whyUs: { enabled: boolean };
    latestBlog: { enabled: boolean };
    cta: { enabled: boolean };
  };
  whyUs: {
    title: string;
    features: Feature[];
  };
  cta: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonUrl: string;
  };
}

const HomepageCMSPage = () => {
  const [content, setContent] = useState<HomepageContent | null>(null);
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
        const res = await fetch(`${apiBase}/site-content/homepage`, {
          headers: { 'x-auth-token': token || '' },
        });
        if (res.ok) {
          const data = await res.json();
          const normalized: HomepageContent = {
            ...data,
            hero: {
              ...data.hero,
              backgroundImage: data?.hero?.backgroundImage ?? null,
              slider: {
                enabled: !!data?.hero?.slider?.enabled,
                intervalMs: data?.hero?.slider?.intervalMs || 5000,
                images: Array.isArray(data?.hero?.slider?.images) ? data.hero.slider.images.slice(0, 3) : [],
              },
            },
          };
          setContent(normalized);
        }
      } catch (error) {
        console.error('Failed to fetch homepage content', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const uploadImage = async (file: File) => {
    const token = localStorage.getItem('token');
    const form = new FormData();
    form.append('image', file);

    const res = await fetch(`${apiBase}/site-content/upload`, {
      method: 'POST',
      headers: { 'x-auth-token': token || '' },
      body: form,
    });

    if (!res.ok) {
      let msg = 'Failed to upload image';
      try {
        const data = await res.json();
        msg = data?.msg || msg;
      } catch {
        // ignore
      }
      throw new Error(msg);
    }

    return (await res.json()) as { url: string; filename?: string };
  };

  const handleBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!content) return;
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setSaving(true);
      const uploaded = await uploadImage(file);
      setContent({
        ...content,
        hero: {
          ...content.hero,
          backgroundImage: uploaded,
        },
      });
    } catch (err: any) {
      alert(err?.message || 'Failed to upload image');
    } finally {
      setSaving(false);
      e.target.value = '';
    }
  };

  const handleRemoveBackground = () => {
    if (!content) return;
    setContent({
      ...content,
      hero: {
        ...content.hero,
        backgroundImage: null,
      },
    });
  };

  const handleSliderToggle = () => {
    if (!content) return;
    setContent({
      ...content,
      hero: {
        ...content.hero,
        slider: {
          ...(content.hero.slider || { enabled: false, images: [] }),
          enabled: !content.hero.slider?.enabled,
          images: (content.hero.slider?.images || []).slice(0, 3),
          intervalMs: content.hero.slider?.intervalMs || 5000,
        },
      },
    });
  };

  const handleSliderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!content) return;
    const file = e.target.files?.[0];
    if (!file) return;
    if ((content.hero.slider?.images?.length || 0) >= 3) {
      alert('Maximum 3 slider images allowed.');
      e.target.value = '';
      return;
    }

    try {
      setSaving(true);
      const uploaded = await uploadImage(file);
      const nextImages = [...(content.hero.slider?.images || []), uploaded].slice(0, 3);
      setContent({
        ...content,
        hero: {
          ...content.hero,
          slider: {
            enabled: !!content.hero.slider?.enabled,
            intervalMs: content.hero.slider?.intervalMs || 5000,
            images: nextImages,
          },
        },
      });
    } catch (err: any) {
      alert(err?.message || 'Failed to upload image');
    } finally {
      setSaving(false);
      e.target.value = '';
    }
  };

  const removeSliderImage = (index: number) => {
    if (!content) return;
    const images = (content.hero.slider?.images || []).filter((_, i) => i !== index);
    setContent({
      ...content,
      hero: {
        ...content.hero,
        slider: {
          enabled: !!content.hero.slider?.enabled,
          intervalMs: content.hero.slider?.intervalMs || 5000,
          images,
        },
      },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, section: string, field: string, index?: number) => {
    if (!content) return;
    const newContent = JSON.parse(JSON.stringify(content)); // Deep copy

    if (section === 'whyUs' && field === 'features' && index !== undefined) {
      const { name, value } = e.target;
      newContent.whyUs.features[index][name as keyof Feature] = value;
    } else if (section === 'whyUs' && field === 'title') {
      newContent.whyUs.title = e.target.value;
    } else if (section === 'sections' && field) {
      (newContent.sections as any)[field].title = e.target.value;
    } else if (section === 'cta') {
      (newContent.cta as any)[field] = e.target.value;
    } else {
      (newContent as any)[section][field] = e.target.value;
    }

    setContent(newContent);
  };

  const handleToggleChange = (sectionName: keyof HomepageContent['sections']) => {
    if (!content) return;
    const newContent = { ...content };
    newContent.sections[sectionName].enabled = !newContent.sections[sectionName].enabled;
    setContent(newContent);
  };

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const payload: HomepageContent = {
        ...content,
        hero: {
          ...content.hero,
          slider: {
            enabled: !!content.hero.slider?.enabled,
            intervalMs: content.hero.slider?.intervalMs || 5000,
            images: (content.hero.slider?.images || []).slice(0, 3),
          },
        },
      };

      await fetch(`${apiBase}/site-content/homepage`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || '',
        },
        body: JSON.stringify(payload),
      });
      alert('Homepage content saved successfully!');
    } catch (error) {
      console.error('Failed to save homepage content', error);
      alert('Failed to save homepage content.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading homepage content...</p>;
  if (!content) return <p>Could not load homepage content.</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Homepage</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Hero Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input 
              type="text"
              value={content.hero.title}
              onChange={(e) => handleInputChange(e, 'hero', 'title')}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subtitle</label>
            <textarea 
              value={content.hero.subtitle}
              onChange={(e) => handleInputChange(e, 'hero', 'subtitle')}
              rows={3}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Hero Background Image</h3>
            {content.hero.backgroundImage?.url ? (
              <div className="space-y-3">
                <img src={content.hero.backgroundImage.url} alt="" className="w-full max-w-md rounded-md" />
                <div className="flex gap-2">
                  <button type="button" onClick={handleRemoveBackground} className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700">
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <input type="file" accept="image/*" onChange={handleBackgroundUpload} className="mt-1 block w-full" />
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Hero Slider</h3>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!content.hero.slider?.enabled} onChange={handleSliderToggle} />
              <span>Enable Automatic Slides</span>
            </label>

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700">Slider Images (max 3)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleSliderUpload}
                disabled={(content.hero.slider?.images?.length || 0) >= 3}
                className="mt-1 block w-full"
              />
            </div>

            {(content.hero.slider?.images || []).length > 0 ? (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(content.hero.slider?.images || []).slice(0, 3).map((img, idx) => (
                  <div key={`${img.url}-${idx}`} className="border rounded-md p-2">
                    <img src={img.url} alt="" className="w-full h-32 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => removeSliderImage(idx)}
                      className="mt-2 w-full bg-red-600 text-white py-1 px-2 rounded-md hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Featured Locations Section</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700">Section Title</label>
          <input 
            type="text"
            value={content.sections.featuredLocations.title}
            onChange={(e) => handleInputChange(e, 'sections', 'featuredLocations')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Why Us Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Section Title</label>
            <input 
              type="text"
              value={content.whyUs.title}
              onChange={(e) => handleInputChange(e, 'whyUs', 'title')}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          {content.whyUs.features.map((feature, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-md space-y-3">
              <h3 className="font-semibold">Feature {index + 1}</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">Icon</label>
                <input type="text" name="icon" value={feature.icon} onChange={(e) => handleInputChange(e, 'whyUs', 'features', index)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input type="text" name="title" value={feature.title} onChange={(e) => handleInputChange(e, 'whyUs', 'features', index)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" value={feature.description} onChange={(e) => handleInputChange(e, 'whyUs', 'features', index)} rows={2} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Call to Action Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" value={content.cta.title} onChange={(e) => handleInputChange(e, 'cta', 'title')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subtitle</label>
            <textarea value={content.cta.subtitle} onChange={(e) => handleInputChange(e, 'cta', 'subtitle')} rows={2} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Button Text</label>
            <input type="text" value={content.cta.buttonText} onChange={(e) => handleInputChange(e, 'cta', 'buttonText')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Button URL</label>
            <input type="text" value={content.cta.buttonUrl} onChange={(e) => handleInputChange(e, 'cta', 'buttonUrl')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Homepage Sections Visibility</h2>
        <div className="space-y-4">
          {Object.entries(content.sections).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={value.enabled} onChange={() => handleToggleChange(key as keyof HomepageContent['sections'])} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={handleSave}
        disabled={saving}
        className="mt-8 w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
      >
        {saving ? 'Saving...' : 'Save Homepage Settings'}
      </button>
    </div>
  );
};

export default withAuth(HomepageCMSPage);
