
'use client'; 
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion';

import ThemeToggle from './ThemeToggle';
import { useTranslation } from 'next-i18next'

// Tách các icon ra để dễ quản lý
const Icons = {
  home: <i className="ri-home-4-line"></i>,
  category: <i className="ri-layout-grid-line"></i>,
  search: <i className="ri-search-line"></i>,
  menu: <i className="ri-menu-3-line text-2xl"></i>,
  close: <i className="ri-close-line text-2xl"></i>,
};

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { locale, locales, asPath } = router; 
  const { pathname } = router  
  const { t, i18n } = useTranslation('common')
  const navLinks = [
    { href: '/',     label: t('nav.home'),     icon: Icons.home },
    { href: '/categories', label: t('nav.category'), icon: Icons.category },
    { href: '/search',    label: t('nav.search'),    icon: Icons.search }
  ]
  

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

 const changeLanguage = (lng: string) => {
    router.push(asPath, asPath, { locale: lng });
 };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.PNG"
            alt="Alpentou Logo"
            width={40}
            height={40}
            priority
            className="transition-transform duration-300 hover:scale-110"
          />
       
        </Link>

        {/* Navigation cho Desktop */}
        <nav className="hidden md:flex items-center gap-2">
          {/* ... navigation code không đổi ... */}
          <ul className="flex gap-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors duration-300 ${
                    pathname === link.href
                      ? 'bg-primary-500 text-white font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="flex items-center gap-2">
            <button
  onClick={() => changeLanguage('vi')}
  className={`px-2 py-1 rounded text-sm transition-colors ${locale === 'vi'
    ? 'bg-primary-500 text-white'
    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
>
  VI
</button>
<button
  onClick={() => changeLanguage('en')}
  className={`px-2 py-1 rounded text-sm transition-colors ${locale === 'en'
    ? 'bg-primary-500 text-white'
    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
>
  EN
</button>

          </div>

          {/* ---- [PHẦN SỬA LỖI Ở ĐÂY] ---- */}
          {/* Thêm một div để đảm bảo icon của ThemeToggle luôn có màu phù hợp */}
          <div className="text-gray-800 dark:text-white">
            <ThemeToggle />
          </div>
          {/* ----------------------------- */}

          {/* Nút mở Menu cho Mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-800 dark:text-white z-50"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? Icons.close : Icons.menu}
          </button>
        </div>
      </div>

      {/* Menu cho Mobile (hiệu ứng trượt xuống) */}
      <AnimatePresence>
        {isMenuOpen && (
          // ... mobile menu code không đổi ...
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg"
          >
            <nav className="flex flex-col items-center p-4">
              <ul className="flex flex-col gap-4 w-full">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 w-full p-3 rounded-lg text-base transition-colors duration-300 ${
                        pathname === link.href
                          ? 'bg-primary-500 text-white font-semibold'
                          : 'text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}