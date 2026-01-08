'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import withAuth from '@/components/admin/withAuth';

interface Blog {
  id: string;
  title: string;
  slug: string;
  createdAt: any;
}

const BlogsPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs`);
        const data = await res.json();
        setBlogs(data);
      } catch (error) {
        console.error('Failed to fetch blogs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${id}`, {
          method: 'DELETE',
          headers: { 'x-auth-token': token || '' },
        });
        setBlogs(blogs.filter((b) => b.id !== id));
      } catch (error) {
        console.error('Failed to delete blog post', error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Blogs</h1>
        <Link href="/admin/blogs/new" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
          Add New Post
        </Link>
      </div>
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blogs.map((blog) => (
                <tr key={blog.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{blog.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{blog.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(blog.createdAt.seconds * 1000).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/blog/${blog.slug}`} target="_blank" className="text-indigo-600 hover:text-indigo-900 mr-4">View</Link>
                    <Link href={`/admin/blogs/edit/${blog.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                    <button onClick={() => handleDelete(blog.id)} className="text-red-600 hover:text-red-900">Delete</button>
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

export default withAuth(BlogsPage);
