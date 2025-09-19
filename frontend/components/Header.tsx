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
    RiUserLine, RiBookOpenLine, RiSettings3Line, RiLogoutBoxRLine, RiTranslate2, RiArrowDownSLine
} from 'react-icons/ri';

import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

// Helper function để tạo avatar an toàn
const getAvatarSrc = (user: { name?: string; avatarUrl?: string } | null): string => {
    if (user?.avatarUrl && user.avatarUrl !== '/images/default-avatar.png') {
        return user.avatarUrl;
    }
    
    // Tạo avatar từ chữ cái đầu của tên
    const firstLetter = user?.name?.[0]?.toUpperCase() || 'U';
    const colors = [
        '7c3aed/ffffff', // purple
        'ef4444/ffffff', // red  
        '3b82f6/ffffff', // blue
        '10b981/ffffff', // green
        'f59e0b/ffffff', // amber
        'ec4899/ffffff', // pink
    ];
    
    // Chọn màu dựa trên tên để avatar luôn consistent
    const colorIndex = user?.name ? user.name.charCodeAt(0) % colors.length : 0;
    const color = colors[colorIndex];
    
    return `https://placehold.co/40x40/${color}?text=${firstLetter}`;
};

// Component chọn ngôn ngữ
const LanguageSwitcher = () => {
    const router = useRouter();
    const { locale, locales, pathname, asPath, query } = router;

    const handleLocaleChange = (newLocale: string) => {
        router.push({ pathname, query }, asPath, { locale: newLocale }).then(() => {
            // Force reload để đảm bảo ngôn ngữ được cập nhật đúng
            window.location.reload();
        });
    };

    return (
        <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                <RiTranslate2 size={18} />
                <span className="hidden sm:inline">{locale?.toUpperCase()}</span>
                <RiArrowDownSLine size={16} />
            </Menu.Button>
            <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                <Menu.Items className="absolute right-0 mt-2 w-24 origin-top-right bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {locales?.map((loc) => (
                        <Menu.Item key={loc}>
                            {({ active }) => (
                                <button onClick={() => handleLocaleChange(loc)} className={`${active ? 'bg-purple-50 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'} block w-full text-left px-4 py-2 text-sm font-medium`}>
                                    {loc === 'vi' ? 'Tiếng Việt' : 'English'}
                                </button>
                            )}
                        </Menu.Item>
                    ))}
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default function Header() {
    const { t } = useTranslation('common');
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Navigation links với translation
    const navLinks = useMemo(() => [
        { href: '/', label: t('home', 'Trang chủ'), icon: <RiHome4Line size={20} /> },
        { href: '/the-loai', label: t('genres', 'Thể loại'), icon: <RiLayoutGridLine size={20} /> },
        { href: '/tim-kiem', label: t('search', 'Tìm kiếm'), icon: <RiSearchLine size={20} /> },
    ], [t, isAuthenticated, router.locale]);

    const handleLogout = useCallback(() => {
        logout();
        router.push('/');
    }, [logout, router]);

    useEffect(() => {
        const handleRouteChange = () => setIsMenuOpen(false);
        router.events.on('routeChangeStart', handleRouteChange);
        return () => router.events.off('routeChangeStart', handleRouteChange);
    }, [router.events]);

    const userMenuItems = useMemo(() => [
        { label: t('profile', 'Hồ sơ'), href: '/user/profile', icon: <RiUserLine size={18} /> },
        { label: t('bookshelf', 'Tủ sách'), href: '/user/tu-sach', icon: <RiBookOpenLine size={18} /> },
        ...(user?.role === 'ADMIN' ? [{ label: t('admin_page', 'Trang Admin'), href: '/admin', icon: <RiSettings3Line size={18} /> }] : []),
        ...(user?.role === 'WRITER' ? [{ label: t('author_page', 'Trang Tác giả'), href: '/tac-gia/truyen', icon: <RiSettings3Line size={18} /> }] : []),
    ], [user, t, router.locale]);

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <Image 
                                src="/images/logo.png" 
                                alt="Alpen Logo" 
                                width={50} 
                                height={50} 
                                priority 
                                style={{ height: 'auto' }}
                            />
                        </Link>
                        
                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                                        router.pathname === link.href
                                            ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30'
                                            : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Right side - Auth & Settings */}
                    <div className="hidden md:flex items-center gap-4">
                        <LanguageSwitcher />
                        <ThemeToggle />
                        
                        {isAuthenticated && user ? (
                            /* User Menu với Avatar */
                            <Menu as="div" className="relative">
                                <Menu.Button className="flex items-center gap-2 rounded-full hover:ring-2 hover:ring-purple-500 hover:ring-offset-2 dark:ring-offset-gray-900 transition-all duration-200">
                                    <div className="relative">
                                        <Image
                                            src={getAvatarSrc(user)}
                                            alt={user?.name || 'User Avatar'}
                                            width={40}
                                            height={40}
                                            className="rounded-full bg-gray-200 border-2 border-gray-200 dark:border-gray-700"
                                        />
                                        {/* Online indicator */}
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                                    </div>
                                    <div className="hidden lg:block text-left">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {user.role === 'ADMIN' ? 'Quản trị viên' : 
                                             user.role === 'WRITER' ? 'Tác giả' : 'Thành viên'}
                                        </p>
                                    </div>
                                </Menu.Button>
                                
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        {/* User Info Header */}
                                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                {user.name}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                        
                                        {/* Menu Items */}
                                        <div className="py-1">
                                            {userMenuItems.map((item) => (
                                                <Menu.Item key={item.href}>
                                                    {({ active }) => (
                                                        <Link
                                                            href={item.href}
                                                            className={`${
                                                                active 
                                                                    ? 'bg-purple-50 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400' 
                                                                    : 'text-gray-700 dark:text-gray-300'
                                                            } group flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors`}
                                                        >
                                                            {item.icon}
                                                            {item.label}
                                                        </Link>
                                                    )}
                                                </Menu.Item>
                                            ))}
                                        </div>
                                        
                                        {/* Logout */}
                                        <div className="py-1">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={handleLogout}
                                                        className={`${
                                                            active 
                                                                ? 'bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400' 
                                                                : 'text-gray-700 dark:text-gray-300'
                                                        } group flex items-center gap-3 px-4 py-2 text-sm font-medium w-full text-left transition-colors`}
                                                    >
                                                        <RiLogoutBoxRLine size={18} />
                                                        {t('logout', 'Đăng xuất')}
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        ) : (
                            /* Login Button */
                            <Link 
                                href="/login" 
                                className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                            >
                                {t('login', 'Đăng nhập')}
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center gap-2">
                        {isAuthenticated && user && (
                            <Image
                                src={getAvatarSrc(user)}
                                alt={user?.name || 'User Avatar'}
                                width={32}
                                height={32}
                                className="rounded-full bg-gray-200"
                            />
                        )}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                            {isMenuOpen ? <RiCloseLine size={24} /> : <RiMenu3Line size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg border-t border-gray-200 dark:border-gray-700"
                    >
                        <nav className="flex flex-col p-4">
                            {/* Navigation Links */}
                            <ul className="flex flex-col gap-2 w-full mb-4">
                                {navLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link 
                                            href={link.href} 
                                            onClick={() => setIsMenuOpen(false)} 
                                            className="flex items-center gap-3 w-full p-3 rounded-lg text-base font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            {link.icon}
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            
                            {/* User Menu for Mobile */}
                            {isAuthenticated && user ? (
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Image
                                            src={getAvatarSrc(user)}
                                            alt={user?.name || 'User Avatar'}
                                            width={40}
                                            height={40}
                                            className="rounded-full bg-gray-200"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                                        </div>
                                    </div>
                                    
                                    {userMenuItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-3 w-full p-3 rounded-lg text-base font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            {item.icon}
                                            {item.label}
                                        </Link>
                                    ))}
                                    
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center gap-3 w-full p-3 rounded-lg text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                    >
                                        <RiLogoutBoxRLine size={18} />
                                        {t('logout', 'Đăng xuất')}
                                    </button>
                                </div>
                            ) : (
                                <Link 
                                    href="/login" 
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-full text-center px-4 py-3 text-base font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    {t('login', 'Đăng nhập')}
                                </Link>
                            )}
                            
                            {/* Settings for Mobile */}
                            <div className="flex items-center justify-center mt-4 border-t pt-4 border-gray-200 dark:border-gray-700 gap-4">
                                <LanguageSwitcher />
                                <ThemeToggle />
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}