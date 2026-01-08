import { Metadata } from 'next';
import BlogDetails from '@/components/public/BlogDetails';

interface Blog {
  title: string;
  content: string;
  image: { url: string };
  createdAt: any;
  seoMetaTitle?: string;
  seoMetaDescription?: string;
}

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error(`Failed to fetch blog ${slug}:`, error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blog = await getBlog(params.slug);

  if (!blog) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: blog.seoMetaTitle || blog.title,
    description: blog.seoMetaDescription || blog.content?.substring(0, 160) || '',
  };
}

const BlogDetailPage = async ({ params }: { params: { slug: string } }) => {
  const blog = await getBlog(params.slug);

  return <BlogDetails blog={blog} />;
};

export default BlogDetailPage;
