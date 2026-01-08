'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import BlogForm from '@/components/admin/BlogForm';
import withAuth from '@/components/admin/withAuth';

interface Blog {
  title: string;
  content: string;
  slug: string;
  seoMetaTitle: string;
  seoMetaDescription: string;
  image?: any;
}

const EditBlogPage = () => {
  const params = useParams();
  const { id } = params;
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/id/${id}`);
        const data = await res.json();
        setBlog(data);
      };
      fetchBlog();
    }
  }, [id]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        {blog ? <BlogForm blog={blog} id={id as string} /> : <p>Loading...</p>}
      </div>
    </div>
  );
};

export default withAuth(EditBlogPage);
