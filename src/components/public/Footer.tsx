'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const socialIconMap: { [key: string]: React.ElementType } = {
  Facebook: FaFacebook,
  Twitter: FaTwitter,
  Instagram: FaInstagram,
};

interface FooterContent {
  about: { text: string };
  quickLinks: { label: string; url: string }[];
  contact: { address: string; email: string; phone: string };
  socialLinks: { platform: string; url: string }[];
}

const fallbackFooter: FooterContent = {
  about: {
    text: 'The #1 platform for billboard and outdoor advertising in Seemanchal, connecting businesses with their target audiences through high-impact, strategically placed hoardings.',
  },
  quickLinks: [
    { label: 'Home', url: '/' },
    { label: 'About Us', url: '/about' },
    { label: 'Contact Us', url: '/contact' },
    { label: 'Blog', url: '/blog' },
  ],
  contact: {
    address: '123 Advertising Lane, Seemanchal, Bihar',
    email: 'info@seemanchalads.com',
    phone: '+91 12345 67890',
  },
  socialLinks: [
    { platform: 'Facebook', url: 'https://facebook.com' },
    { platform: 'Twitter', url: 'https://twitter.com' },
    { platform: 'Instagram', url: 'https://instagram.com' },
  ],
};

const Footer = () => {
  const [content, setContent] = useState<FooterContent | null>(null);

  const apiBase = (() => {
    const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const trimmed = raw.replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  })();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${apiBase}/site-content/footer`, { cache: 'no-store' });
        if (!res.ok) {
          setContent(fallbackFooter);
          return;
        }
        const data = await res.json();
        setContent(data);
      } catch (error) {
        console.error('Failed to fetch footer content', error);
        setContent(fallbackFooter);
      }
    };
    fetchContent();
  }, [apiBase]);

  if (!content) {
    return (
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>Loading footer...</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-gray-400 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* About Section */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold text-white mb-4">Seemanchal Advertising</h3>
            <p className="text-sm">{content.about.text}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {content.quickLinks.map(link => (
                <li key={link.url}>
                  <Link href={link.url} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Contact Us</h3>
            <address className="not-italic space-y-2 text-sm">
              <p>{content.contact.address}</p>
              <p><a href={`mailto:${content.contact.email}`} className="hover:text-white">{content.contact.email}</a></p>
              <p><a href={`tel:${content.contact.phone.replace(/\s/g, '')}`} className="hover:text-white">{content.contact.phone}</a></p>
            </address>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {content.socialLinks.map(link => {
                const Icon = socialIconMap[link.platform];
                return Icon ? (
                  <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    <Icon size={24} />
                  </a>
                ) : null;
              })}
            </div>
          </div>

        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <div className="flex items-center justify-center gap-4 mb-3">
            <Link href="/terms" className="hover:text-white transition-colors">Terms &amp; Conditions</Link>
            <span className="text-gray-700">|</span>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy &amp; Policy</Link>
          </div>
          <p>&copy; {new Date().getFullYear()} Seemanchal Advertising. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
