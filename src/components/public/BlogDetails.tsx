'use client';

interface Blog {
  title: string;
  content: string;
  image: { url: string };
  createdAt: any;
}

const BlogDetails = ({ blog }: { blog: Blog | null }) => {
  if (!blog) {
    return <p className="text-center py-10">Blog post not found.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="prose lg:prose-xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
        <p className="text-gray-500 mb-4">{new Date(blog.createdAt.seconds * 1000).toLocaleDateString()}</p>
        {blog.image && <img src={blog.image.url} alt={blog.title} className="w-full rounded-lg shadow-md mb-8" />}
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </article>
    </div>
  );
};

export default BlogDetails;
