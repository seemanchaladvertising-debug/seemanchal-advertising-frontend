'use client';

import { useEffect, useState } from 'react';
import { FiTarget, FiAward, FiUsers } from 'react-icons/fi';

const iconMap: { [key: string]: React.ElementType } = {
  Target: FiTarget,
  Award: FiAward,
  Users: FiUsers,
};

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface WhyUsContent {
  title: string;
  features: Feature[];
}

const WhyUs = () => {
  const [content, setContent] = useState<WhyUsContent | null>(null);

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
          if (data.sections.whyUs.enabled) {
            setContent(data.whyUs);
          }
        }
      } catch (error) {
        console.error('Failed to fetch Why Us content', error);
      }
    };
    fetchContent();
  }, [apiBase]);

  if (!content) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-12">{content.title}</h2>
        <div className="grid md:grid-cols-3 gap-12">
          {content.features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || FiTarget;
            return (
              <div key={index} className="flex flex-col items-center">
                <div className="bg-indigo-100 text-indigo-600 rounded-full p-4 mb-4">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
