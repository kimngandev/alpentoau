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

// --- CẢI TIẾN: Hàm helper an toàn để lấy link avatar ---
const getAvatarSrc = (user: { name?: string; avatarUrl?: string } | null): string => {
    if (user?.avatarUrl) return user.avatarUrl;
    const firstLetter = user?.name?.[0]?.toUpperCase();
    if (firstLetter) return `https://placehold.co/40x40/7c3aed/ffffff?text=${firstLetter}`;
    return 'https://placehold.co/40x40/7c3aed/ffffff?text=U';
};

// --- Component chọn ngôn ngữ ---
const LanguageSwitcher = () => {
    const router = useRouter();
    const { locale, locales, pathname, asPath, query } = router;

    const handleLocaleChange = (newLocale: string) => {
        // SỬA LỖI: Buộc tải lại trang sau khi chuyển route.
        // Đây là giải pháp cần thiết khi các trang chưa được cấu hình serverSideTranslations
        // để tự động cập nhật bản dịch một cách mượt mà.
        router.push({ pathname, query }, asPath, { locale: newLocale }).then(() => {
            router.reload();
        });
    };

    return (
        <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <RiTranslate2 size={18} />
                <span>{locale?.toUpperCase()}</span>
                <RiArrowDownSLine />
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
                <Menu.Items className="absolute right-0 mt-2 w-24 origin-top-right bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        {locales?.map((loc) => (
                            <Menu.Item key={loc}>
                                {({ active }) => (
                                    <button
                                        onClick={() => handleLocaleChange(loc)}
                                        className={`${active ? 'bg-purple-500 text-white' : 'text-gray-900 dark:text-gray-200'
                                            } group flex items-center w-full px-4 py-2 text-sm font-semibold`}
                                    >
                                        {loc.toUpperCase()}
                                    </button>
                                )}
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};


export default function Header() {
    const { t } = useTranslation('common');
    const { isAuthenticated, user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    const navLinks = useMemo(() => {
        const links = [
            { href: '/', label: t('home'), icon: <RiHome4Line size={20} /> },
            { href: '/the-loai', label: t('genres'), icon: <RiLayoutGridLine size={20} /> },
        ];
        if (isAuthenticated) {
            links.push({
                href: '/user/tu-sach',
                label: t('bookshelf', 'Tủ sách'),
                icon: <RiBookOpenLine size={20} />
            });
        }
        return links;
        // SỬA LỖI: Thêm router.locale vào dependency array.
        // Buộc useMemo phải tính toán lại navLinks khi ngôn ngữ thay đổi.
    }, [t, isAuthenticated, router.locale]);

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
    ], [user, t, router.locale]); // Cũng thêm t và router.locale ở đây để đảm bảo menu người dùng được dịch

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <Image src="/images/logo.png" alt="Alpen Logo" width={50} height={50} priority style={{ height: 'auto' }}/>
                        </Link>
                        <nav className="hidden md:flex items-center gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${router.pathname === link.href
                                        ? 'text-white bg-purple-600'
                                        : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="hidden lg:block relative">
                            <RiSearchLine className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t('search', 'Tìm kiếm...')}
                                className="w-48 pl-10 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-2 sm:gap-4">
                                <LanguageSwitcher />
                                <ThemeToggle />
                                <Menu as="div" className="relative">
                                    <Menu.Button className="flex items-center gap-2 rounded-full hover:ring-2 hover:ring-purple-500 hover:ring-offset-2 dark:ring-offset-gray-900 transition-all">
                                        <Image
                                            src={getAvatarSrc(user)}
                                            alt={user?.name || 'User Avatar'}
                                            width={40}
                                            height={40}
                                            className="rounded-full bg-gray-200"
                                        />
                                    </Menu.Button>
                                    <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                                        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <div className="px-1 py-1">
                                                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                                                </div>
                                                {userMenuItems.map((item) => (
                                                    <Menu.Item key={item.href}>
                                                        {({ active }) => (
                                                            <Link href={item.href} className={`${active ? 'bg-purple-500 text-white' : 'text-gray-900 dark:text-gray-200'} group flex rounded-md items-center w-full px-4 py-2 text-sm gap-3`}>
                                                                {item.icon}
                                                                {item.label}
                                                            </Link>
                                                        )}
                                                    </Menu.Item>
                                                ))}
                                            </div>
                                            <div className="px-1 py-1">
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button onClick={handleLogout} className={`${active ? 'bg-red-500 text-white' : 'text-red-600 dark:text-red-400'} group flex rounded-md items-center w-full px-4 py-2 text-sm gap-3`}>
                                                            <RiLogoutBoxRLine size={18} />
                                                            {t('logout', 'Đăng xuất')}
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                            </div>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-2">
                                <LanguageSwitcher />
                                <ThemeToggle />
                                <Link href="/login" className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
                                    {t('login', 'Đăng nhập')}
                                </Link>
                            </div>
                        )}

                        <button className="md:hidden p-2 text-gray-700 dark:text-gray-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <RiCloseLine size={24} /> : <RiMenu3Line size={24} />}
                        </button>
                    </div>
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
                                    {t('login', 'Đăng nhập')}
                                </Link>
                            )}
                             <div className="md:hidden flex items-center justify-center mt-4 border-t pt-4 border-gray-200 dark:border-gray-700">
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

