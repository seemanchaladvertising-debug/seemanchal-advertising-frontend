import Hero from '@/components/home/Hero';
import FeaturedBuildings from '@/components/home/FeaturedBuildings';
import WhyUs from '@/components/home/WhyUs';
import LatestBlog from '@/components/home/LatestBlog';
import CTA from '@/components/home/CTA';
import PublicLayout from './(public)/layout';

export default function Home() {
  return (
    <PublicLayout>
      <Hero />
      <FeaturedBuildings />
      <WhyUs />
      <LatestBlog />
      <CTA />
    </PublicLayout>
  );
}
