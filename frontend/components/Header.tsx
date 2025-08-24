// frontend/components/Header.tsx

'use client'; 
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion';

import ThemeToggle from './ThemeToggle';
import { useTranslation } from 'next-i18next'
// *** BỔ SUNG: Import hook useAuth để lấy thông tin người dùng ***
import { useAuth } from '../contexts/AuthContext'; 

// Tách các icon ra để dễ quản lý
const Icons = {
  home: <i className="ri-home-4-line"></i>,
  category: <i className="ri-layout-grid-line"></i>,
  search: <i className="ri-search-line"></i>,
  menu: <i className="ri-menu-3-line text-2xl"></i>,
  close: <i className="ri-close-line text-2xl"></i>,
  // *** BỔ SUNG: Icon cho người dùng và đăng xuất ***
  login: <i className="ri-user-line"></i>,
  logout: <i className="ri-logout-box-r-line"></i>,
  bookshelf: <i className="ri-book-shelf-line"></i>,
};

// *** BỔ SUNG: Component UserMenu khi đã đăng nhập ***
const UserMenu = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative" onMouseLeave={() => setIsOpen(false)}>
      <button 
        onMouseEnter={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Image 
          src={user.avatarUrl || 'https://placehold.co/40x40/a78bfa/fff?text=A'}
          alt="User Avatar"
          width={32}
          height={32}
          className="rounded-full border-2 border-transparent group-hover:border-primary-500"
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full right-0 mt-2 w-48 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="p-2">
              <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="font-semibold text-sm text-gray-800 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
              </div>
              <div className="mt-1">
                <Link href="/user/tu-sach" className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md">
                  {Icons.bookshelf} Tủ sách
                </Link>
                <button onClick={onLogout} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md">
                  {Icons.logout} Đăng xuất
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { locale, asPath, pathname } = router; 
  const { t } = useTranslation('common');
  // *** BỔ SUNG: Lấy trạng thái đăng nhập từ context ***
  const { isAuthenticated, user, logout } = useAuth();

  const navLinks = [
    { href: '/',     label: t('nav.home'),     icon: Icons.home },
    { href: '/categories', label: t('nav.category'), icon: Icons.category },
    { href: '/search',    label: t('nav.search'),    icon: Icons.search }
  ];
  
  useEffect(() => {
    const handleScroll = () => { setIsScrolled(window.scrollY > 10); };
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
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/logo.PNG" alt="Alpentou Logo" width={40} height={40} priority className="transition-transform duration-300 hover:scale-110" />
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          <ul className="flex gap-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors duration-300 ${pathname === link.href ? 'bg-primary-500 text-white font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                  {link.icon} {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {/* Language Switcher giữ nguyên */}
          </div>
          <div className="text-gray-800 dark:text-white"><ThemeToggle /></div>
          
          {/* *** THAY ĐỔI CHÍNH: HIỂN THỊ ĐỘNG NÚT ĐĂNG NHẬP HOẶC MENU NGƯỜI DÙNG *** */}
          <div className="hidden md:flex">
            {isAuthenticated && user ? (
              <UserMenu user={user} onLogout={logout} />
            ) : (
              <Link href="/login" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                {Icons.login} {t('login')}
              </Link>
            )}
          </div>
          
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-800 dark:text-white z-50" aria-label="Toggle menu">
            {isMenuOpen ? Icons.close : Icons.menu}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
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
                    <Link href={link.href} onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-3 w-full p-3 rounded-lg text-base transition-colors duration-300 ${pathname === link.href ? 'bg-primary-500 text-white font-semibold' : 'text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                      {link.icon} {link.label}
                    </Link>
                  </li>
                ))}
                {/* *** BỔ SUNG: Nút đăng nhập/đăng xuất cho menu mobile *** */}
                <li className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                  {isAuthenticated && user ? (
                    <div className="flex flex-col gap-4">
                       <Link href="/user/tu-sach" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 w-full p-3 rounded-lg text-base text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">
                         {Icons.bookshelf} Tủ sách
                       </Link>
                       <button onClick={() => { logout(); setIsMenuOpen(false); }} className="flex items-center gap-3 w-full p-3 rounded-lg text-base text-red-500 hover:bg-gray-200 dark:hover:bg-gray-700">
                         {Icons.logout} Đăng xuất
                       </button>
                    </div>
                  ) : (
                    <Link href="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 w-full p-3 rounded-lg text-base text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">
                      {Icons.login} {t('login')}
                    </Link>
                  )}
                </li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
