'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Blog {
  title: string;
  content: string;
  slug: string;
  seoMetaTitle: string;
  seoMetaDescription: string;
  image?: any;
  existingImage?: any;
}

interface BlogFormProps {
  blog?: Blog;
  id?: string;
}

const BlogForm: React.FC<BlogFormProps> = ({ blog, id }) => {
  const [formData, setFormData] = useState<Blog>({
    title: '',
    content: '',
    slug: '',
    seoMetaTitle: '',
    seoMetaDescription: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (blog) {
      setFormData({
        ...blog,
        existingImage: blog.image || null,
      });
    }
  }, [blog]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newSlug = name === 'title' ? value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') : formData.slug;
    setFormData({ ...formData, [name]: value, slug: newSlug });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const data = new FormData();
    Object.keys(formData).forEach(key => {
        data.append(key, (formData as any)[key]);
    });

    try {
      const token = localStorage.getItem('token');
      const url = id ? `${process.env.NEXT_PUBLIC_API_URL}/blogs/${id}` : `${process.env.NEXT_PUBLIC_API_URL}/blogs`;
      const method = id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'x-auth-token': token || '' },
        body: data,
      });

      if (!res.ok) throw new Error('Something went wrong');

      router.push('/admin/blogs');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Slug</label>
        <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100" readOnly />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Content</label>
        <textarea name="content" value={formData.content} onChange={handleChange} rows={10} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Featured Image</label>
        <input type="file" name="image" onChange={handleFileChange} className="mt-1 block w-full" />
        {formData.existingImage && (
          <img src={formData.existingImage.url} alt="Existing image" className="mt-4 w-48 h-auto rounded-md" />
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
        {submitting ? 'Saving...' : 'Save Post'}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </form>
  );
};

export default BlogForm;
