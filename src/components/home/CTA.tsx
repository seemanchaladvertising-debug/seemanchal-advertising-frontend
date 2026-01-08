'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CtaContent {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonUrl: string;
}

interface SectionSettings {
  enabled: boolean;
}

const CTA = () => {
  const [content, setContent] = useState<CtaContent | null>(null);
  const [settings, setSettings] = useState<SectionSettings | null>(null);

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
          setContent(data.cta);
          setSettings(data.sections.cta);
        }
      } catch (error) {
        console.error('Failed to fetch CTA content', error);
      }
    };
    fetchContent();
  }, [apiBase]);

  if (!settings?.enabled || !content) return null;

  return (
    <section className="bg-indigo-600">
      <div className="container mx-auto px-4 py-16 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">{content.title}</h2>
        <p className="mb-8 max-w-2xl mx-auto">{content.subtitle}</p>
        <Link href={content.buttonUrl}>
          <div className="inline-block bg-white text-indigo-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-200 transition-colors">
            {content.buttonText}
          </div>
        </Link>
      </div>
    </section>
  );
};

export default CTA;
