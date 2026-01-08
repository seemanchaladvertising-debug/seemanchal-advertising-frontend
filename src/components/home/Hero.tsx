'use client';

import { useEffect, useState } from 'react';
import SearchForm from '@/components/public/SearchForm';

interface HeroContent {
  title: string;
  subtitle: string;
  backgroundImage?: { url: string; filename?: string } | string | null;
  slider?: {
    enabled?: boolean;
    intervalMs?: number;
    images?: Array<{ url: string; filename?: string } | string>;
  };
}

const Hero = () => {
  const [content, setContent] = useState<HeroContent | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const apiBase = (() => {
    const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const trimmed = raw.replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  })();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${apiBase}/site-content/homepage`);
        if (res.ok) {
          const data = await res.json();
          setContent(data.hero);
        }
      } catch (error) {
        console.error('Failed to fetch hero content', error);
      }
    };
    fetchContent();
  }, []);

  useEffect(() => {
    const enabled = !!content?.slider?.enabled;
    const images = content?.slider?.images || [];
    const intervalMs = content?.slider?.intervalMs || 5000;

    if (!enabled || images.length <= 1) return;

    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [content?.slider?.enabled, content?.slider?.images, content?.slider?.intervalMs]);

  const sliderImages = (content?.slider?.images || [])
    .map((img) => (typeof img === 'string' ? img : img?.url))
    .filter(Boolean) as string[];

  const backgroundUrl = (() => {
    const bg = content?.backgroundImage;
    if (!bg) return '';
    return typeof bg === 'string' ? bg : bg?.url;
  })();

  return (
    <section
      className="relative w-full flex items-center justify-center text-white"
      style={{ height: 'min(540px, 28.125vw)' }}
    >
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
      {content?.slider?.enabled && sliderImages.length > 0 ? (
        <div className="absolute inset-0 w-full h-full">
          {sliderImages.slice(0, 3).map((url, idx) => (
            <img
              key={`${url}-${idx}`}
              src={url}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === (activeIndex % sliderImages.length) ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
        </div>
      ) : backgroundUrl ? (
        <img src={backgroundUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <div className="relative z-20 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
          {content?.title || '...'}
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
          {content?.subtitle || ''}
        </p>
        <div className="max-w-2xl mx-auto bg-white/20 backdrop-blur-sm p-4 rounded-lg">
          <SearchForm />
        </div>
      </div>
    </section>
  );
};

export default Hero;
