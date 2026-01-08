'use client';

import { useEffect, useState } from 'react';

const FloatingWhatsApp = () => {
  const [whatsappNumber, setWhatsappNumber] = useState('');

  const apiBase = (() => {
    const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const trimmed = raw.replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  })();

  useEffect(() => {
    const fetchNumber = async () => {
      try {
        const res = await fetch(`${apiBase}/site-content/settings`);
        if (res.ok) {
          const data = await res.json();
          const num = data?.whatsappNumber ?? '';
          setWhatsappNumber(typeof num === 'string' ? num : String(num));
        }
      } catch (error) {
        console.error('Failed to fetch WhatsApp number', error);
      }
    };
    fetchNumber();
  }, []);

  const waNumber = whatsappNumber.replace(/[^\d]/g, '');
  if (!waNumber) return null;

  return (
    <a
      href={`https://wa.me/${waNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 bg-green-500 hover:bg-green-600 text-white font-bold p-4 rounded-full shadow-lg z-50 transition-transform transform hover:scale-110"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
    </a>
  );
};

export default FloatingWhatsApp;
