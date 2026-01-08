'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Building {
  title: string;
  description: string;
  locationName: string;
  pincode: string;
  hoardingSize?: string;
  marketPrice?: string | number | null;
  dealPrice?: string | number | null;
  discountPercent?: string | number | null;
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
  existingImages?: any[];
}

interface BuildingFormProps {
  building?: Building;
  id?: string;
}

const BuildingForm: React.FC<BuildingFormProps> = ({ building, id }) => {
  const [formData, setFormData] = useState<Building>({
    title: '',
    description: '',
    locationName: '',
    pincode: '',
    hoardingSize: '',
    marketPrice: '',
    dealPrice: '',
    discountPercent: '',
    facingDirection: '',
    hoardingCode: '',
    lightType: '',
    dailyTraffic: '',
    agencyName: '',
    lat: 0,
    lng: 0,
    isAvailable: true,
    seoMetaTitle: '',
    seoMetaDescription: '',
    images: [],
    existingImages: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState('');
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (building) {
      setFormData({
        ...building,
        hoardingSize: building.hoardingSize || '',
        marketPrice: (building as any).marketPrice === null || (building as any).marketPrice === undefined ? '' : String((building as any).marketPrice),
        dealPrice: (building as any).dealPrice === null || (building as any).dealPrice === undefined ? '' : String((building as any).dealPrice),
        discountPercent: (building as any).discountPercent === null || (building as any).discountPercent === undefined ? '' : String((building as any).discountPercent),
        facingDirection: (building as any).facingDirection || '',
        hoardingCode: (building as any).hoardingCode || '',
        lightType: (building as any).lightType || '',
        dailyTraffic: (building as any).dailyTraffic || '',
        agencyName: (building as any).agencyName || '',
        existingImages: building.images || [],
        images: [],
      });
    }
  }, [building]);

  useEffect(() => {
    const files = formData.images || [];
    const urls = files.map((file: any) => URL.createObjectURL(file));
    setNewImagePreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [formData.images]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 3);
      const existingCount = formData.existingImages?.length || 0;
      const maxNewAllowed = Math.max(0, 3 - existingCount);
      const limited = files.slice(0, maxNewAllowed);

      if (files.length > maxNewAllowed) {
        setImageError(`Maximum 3 images are allowed. You can add only ${maxNewAllowed} more.`);
      } else {
        setImageError('');
      }

      setFormData({ ...formData, images: limited });
    }
  };

  const removeExistingImage = (index: number) => {
    setFormData({
      ...formData,
      existingImages: (formData.existingImages || []).filter((_: any, i: number) => i !== index),
    });
    setImageError('');
  };

  const removeNewImage = (index: number) => {
    setFormData({
      ...formData,
      images: (formData.images || []).filter((_: any, i: number) => i !== index),
    });
    setImageError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setImageError('');

    const existingCount = formData.existingImages?.length || 0;
    const newCount = formData.images?.length || 0;
    const totalCount = existingCount + newCount;

    if (!id && totalCount < 1) {
      setSubmitting(false);
      setImageError('Please upload at least 1 image.');
      return;
    }

    if (totalCount > 3) {
      setSubmitting(false);
      setImageError('Maximum 3 images are allowed.');
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => {
        if (key === 'images' && formData.images) {
            formData.images.forEach(file => data.append('images', file));
        } else if (key === 'existingImages') {
            data.append(key, JSON.stringify(formData.existingImages));
        } else {
            data.append(key, (formData as any)[key]);
        }
    });

    try {
      const token = localStorage.getItem('token');
      const url = id ? `${process.env.NEXT_PUBLIC_API_URL}/buildings/${id}` : `${process.env.NEXT_PUBLIC_API_URL}/buildings`;
      const method = id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'x-auth-token': token || '' },
        body: data,
      });

      if (!res.ok) throw new Error('Something went wrong');

      router.push('/admin/buildings');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location Name</label>
          <input type="text" name="locationName" value={formData.locationName} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Pincode</label>
          <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Hoarding Size</label>
          <input type="text" name="hoardingSize" value={formData.hoardingSize ?? ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="e.g. 20ft x 10ft" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Agency Name</label>
          <input type="text" name="agencyName" value={formData.agencyName ?? ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Facing Direction</label>
          <select name="facingDirection" value={formData.facingDirection || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
            <option value="">Select direction</option>
            <option value="North">North</option>
            <option value="South">South</option>
            <option value="East">East</option>
            <option value="West">West</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Hoarding Code</label>
          <input type="text" name="hoardingCode" value={formData.hoardingCode ?? ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="e.g. Pat-147" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Light Type</label>
          <input type="text" name="lightType" value={formData.lightType ?? ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="e.g. Frontlit / Backlit / No Light" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Daily Traffic</label>
          <input type="text" name="dailyTraffic" value={formData.dailyTraffic ?? ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="e.g. High / Medium / Low" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Market Price</label>
          <input type="number" name="marketPrice" value={formData.marketPrice ?? ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="e.g. 8000" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Deal Price</label>
          <input type="number" name="dealPrice" value={formData.dealPrice ?? ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="e.g. 6500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Discount %</label>
          <input type="number" name="discountPercent" value={formData.discountPercent ?? ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="Auto if empty" />
        </div>
        <div className="flex items-center">
          <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
          <label className="ml-2 block text-sm text-gray-900">Is Available</label>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} rows={6} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Images</label>
        <p className="text-xs text-gray-500 mt-1">Minimum 1 image. Maximum 3 images.</p>
        <input
          type="file"
          name="images"
          onChange={handleFileChange}
          multiple
          accept="image/*"
          disabled={(formData.existingImages?.length || 0) >= 3}
          className="mt-2 block w-full"
        />
        <div className="mt-2 text-sm text-gray-600">
          Selected: {(formData.existingImages?.length || 0) + (formData.images?.length || 0)} / 3
        </div>
        {imageError && <p className="text-red-500 mt-2">{imageError}</p>}
        {formData.existingImages && formData.existingImages.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Existing Images</div>
            <div className="grid grid-cols-3 gap-4">
              {formData.existingImages.map((img, index) => (
                <div key={index} className="relative">
                  <img src={img.url} alt="Existing image" className="w-full h-auto rounded-md" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {newImagePreviews.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-medium text-gray-700 mb-2">New Images (To Upload)</div>
            <div className="grid grid-cols-3 gap-4">
              {newImagePreviews.map((url, index) => (
                <div key={url} className="relative">
                  <img src={url} alt="New image" className="w-full h-auto rounded-md" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">SEO Meta</h3>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Meta Title</label>
            <input type="text" name="seoMetaTitle" value={formData.seoMetaTitle} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Meta Description</label>
            <textarea name="seoMetaDescription" value={formData.seoMetaDescription} onChange={handleChange} rows={3} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
          </div>
        </div>
      </div>
      <button type="submit" disabled={submitting} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400">
        {submitting ? 'Saving...' : 'Save Building'}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </form>
  );
};

export default BuildingForm;
