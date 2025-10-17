// frontend/components/AuthorLayout.tsx

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { RiDashboardLine, RiBook2Line, RiAddCircleLine, RiLogoutBoxRLine } from 'react-icons/ri';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../contexts/AuthContext';

type AuthorLayoutProps = {
  children: ReactNode;
};

const AuthorLayout = ({ children }: AuthorLayoutProps) => {
  const router = useRouter();
  const { logout } = useAuth();

  const menuItems = [
    { href: '/tac-gia', label: 'Bảng điều khiển', icon: <RiDashboardLine /> },
    { href: '/tac-gia/truyen', label: 'Quản lý truyện', icon: <RiBook2Line /> },
    { href: '/tac-gia/truyen/moi', label: 'Viết truyện mới', icon: <RiAddCircleLine /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header />
      <main className="container mx-auto px-4 py-12 md:py-16">
        <div className="md:flex md:gap-8">
          <aside className="w-full md:w-1/4 lg:w-1/5 mb-8 md:mb-0">
            <div className="sticky top-24 bg-white dark:bg-gray-800/50 backdrop-blur-md rounded-xl p-4 border border-gray-200 dark:border-gray-700/60 shadow-sm">
              <h3 className="text-lg font-semibold px-4 mb-2">Khu vực Tác giả</h3>
              <nav className="flex flex-col space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors duration-200 text-sm font-medium ${
                      router.pathname === item.href
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
                 <button 
                    onClick={logout} 
                    className="flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors duration-200 text-sm font-medium text-red-500 hover:bg-red-500/10"
                 >
                    <RiLogoutBoxRLine />
                    <span>Đăng xuất</span>
                </button>
              </nav>
            </div>
          </aside>
          <div className="w-full md:w-3/4 lg:w-4/5">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AuthorLayout;