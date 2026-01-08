'use client';

import BlogForm from '@/components/admin/BlogForm';
import withAuth from '@/components/admin/withAuth';

const NewBlogPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New Post</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <BlogForm />
      </div>
    </div>
  );
};

export default withAuth(NewBlogPage);
