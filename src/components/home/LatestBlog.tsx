'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Post {
  id: string;
  slug: string;
  title: string;
  image: { url: string };
  createdAt: any;
}

const LatestBlog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [blogEnabled, setBlogEnabled] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/site-content/homepage`);
        if (res.ok) {
          const data = await res.json();
          setBlogEnabled(data.sections.latestBlog.enabled);
        }
      } catch (error) {
        console.error('Failed to fetch blog settings', error);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs?limit=3`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (error) {
        console.error('Failed to fetch latest posts', error);
      }
    };

    fetchSettings();
    fetchPosts();
  }, []);

  if (!blogEnabled || posts.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">From Our Blog</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                <img src={post.image.url} alt={post.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-2">{new Date(post.createdAt.seconds * 1000).toLocaleDateString()}</p>
                  <h3 className="text-xl font-bold mb-4">{post.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestBlog;
