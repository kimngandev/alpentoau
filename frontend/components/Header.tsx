// frontend/components/Header.tsx

'use client';
import React, { useState, useEffect, useMemo, Fragment, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { Menu, Transition } from '@headlessui/react';
import {
    RiHome4Line, RiLayoutGridLine, RiSearchLine, RiMenu3Line, RiCloseLine,
    RiUserLine, RiBookOpenLine, RiSettings3Line, RiLogoutBoxRLine
} from 'react-icons/ri';

import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

// --- CẢI TIẾN: Hàm helper an toàn để lấy link avatar ---
// Hàm này sẽ xử lý mọi trường hợp để không gây ra lỗi runtime
const getAvatarSrc = (user: { name?: string; avatarUrl?: string } | null): string => {
    // 1. Ưu tiên avatarUrl nếu có
    if (user?.avatarUrl) {
        return user.avatarUrl;
    }
    // 2. Lấy chữ cái đầu của tên
    const firstLetter = user?.name?.[0]?.toUpperCase();
    // 3. Nếu có chữ cái đầu, tạo placeholder với chữ đó
    if (firstLetter) {
        return `https://placehold.co/40x40/c084fc/fff?text=${firstLetter}`;
    }
    // 4. Trường hợp cuối cùng (user null, không có tên), dùng placeholder mặc định
    return `https://placehold.co/40x40/c084fc/fff?text=U`;
};

// Component Nút Chuyển Ngôn Ngữ (để code gọn hơn)
const LanguageSwitcher = () => {
    const router = useRouter();
    const { locale } = router;

    const changeLanguage = useCallback((lng: string) => {
        router.push(router.pathname, router.asPath, { locale: lng });
    }, [router]);

    return (
        <div className="hidden sm:flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
            <button
                onClick={() => changeLanguage('vi')}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${locale === 'vi' ? 'bg-white dark:bg-gray-700 shadow font-semibold' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
                VI
            </button>
            <button
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${locale === 'en' ? 'bg-white dark:bg-gray-700 shadow font-semibold' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
                EN
            </button>
        </div>
    );
};

export default function Header() {
    const { t } = useTranslation('common');
    const { user, isAuthenticated, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { pathname } = useRouter();

    const navLinks = useMemo(() => [
        { href: '/', label: t('nav.home'), icon: <RiHome4Line /> },
        { href: '/the-loai', label: t('nav.category'), icon: <RiLayoutGridLine /> },
    ], [t]);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md' : 'bg-transparent'
            }`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                {/* === NHÓM BÊN TRÁI: Logo & Điều hướng chính === */}
                <div className="flex items-center gap-4 lg:gap-8">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                        <Image
                            src="/images/logo.png" // Đảm bảo tên file là .png
                            alt="Alpentou Logo"
                            width={40}
                            height={40}
                            priority
                            className="transition-transform duration-300 hover:scale-110"
                        />
                    </Link>

                    {/* Navigation cho Desktop */}
                    <nav className="hidden md:flex items-center">
                        <ul className="flex gap-2 text-sm">
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors duration-300 ${
                                            pathname.startsWith(link.href) && (link.href !== '/' || pathname === '/')
                                                ? 'bg-purple-600 text-white font-semibold shadow-md'
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
                </div>

                {/* === NHÓM BÊN PHẢI: Các nút điều khiển === */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <LanguageSwitcher />
                    <ThemeToggle />

                    {/* User Menu hoặc Nút Đăng nhập */}
                    {isAuthenticated ? (
                        <Menu as="div" className="relative">
                            <Menu.Button className="flex items-center justify-center w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <Image src={getAvatarSrc(user)} alt="User Avatar" width={40} height={40} />
                            </Menu.Button>
                            <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="px-1 py-1">
                                        <Menu.Item>
                                            <Link href="/user/tu-sach" className="text-gray-900 dark:text-gray-200 group flex rounded-md items-center w-full px-2 py-2 text-sm gap-2 hover:bg-purple-500 hover:text-white">
                                                <RiBookOpenLine /> Tủ sách
                                            </Link>
                                        </Menu.Item>
                                    </div>
                                    <div className="px-1 py-1">
                                         <Menu.Item>
                                            <button onClick={logout} className={'text-gray-900 dark:text-gray-200 group flex rounded-md items-center w-full px-2 py-2 text-sm gap-2 hover:bg-purple-500 hover:text-white'}>
                                                <RiLogoutBoxRLine /> Đăng xuất
                                            </button>
                                        </Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    ) : (
                        <Link href="/login" className="hidden sm:block px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-full hover:bg-purple-700 transition-colors">
                            Đăng nhập
                        </Link>
                    )}
                    
                    {/* Nút Menu Mobile */}
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-800 dark:text-white z-50 text-2xl" aria-label="Toggle menu">
                        {isMenuOpen ? <RiCloseLine /> : <RiMenu3Line />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg"
                    >
                        <nav className="flex flex-col p-4">
                            <ul className="flex flex-col gap-4 w-full mb-4">
                                {navLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 w-full p-3 rounded-lg text-base font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">
                                            {link.icon}
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                             {!isAuthenticated && (
                                <Link href="/login" className="w-full text-center px-4 py-3 text-base font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
                                    Đăng nhập
                                </Link>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

