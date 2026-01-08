'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const Header = () => {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    if (isHome) {
      window.addEventListener('scroll', handleScroll);
      // Set initial state
      handleScroll();
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isHome]);

  const headerClasses = isHome
    ? `fixed top-0 left-0 w-full z-30 transition-all duration-300 border-b ${isScrolled ? 'bg-white shadow-md border-gray-200' : 'bg-transparent border-white/20'}`
    : 'relative bg-white shadow-md border-b border-gray-200';

  const linkColor = isHome && !isScrolled ? 'text-white' : 'text-gray-600';
  const hoverLinkColor = isHome && !isScrolled ? 'hover:text-gray-200' : 'hover:text-gray-800';
  const logoColor = isHome && !isScrolled ? 'text-white' : 'text-gray-800';

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className={`text-2xl font-bold transition-colors duration-300 ${logoColor}`}>
          Seemanchal Advertising
        </Link>
        <nav>
          <Link href="/" className={`${linkColor} ${hoverLinkColor} px-3 py-2`}>Home</Link>
          <Link href="/about" className={`${linkColor} ${hoverLinkColor} px-3 py-2`}>About Us</Link>
          <Link href="/contact" className={`${linkColor} ${hoverLinkColor} px-3 py-2`}>Contact Us</Link>
          <Link href="/blog" className={`${linkColor} ${hoverLinkColor} px-3 py-2`}>Blog</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
