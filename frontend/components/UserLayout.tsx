// frontend/components/UserLayout.tsx

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
// Thêm icon cho các mục mới
import { 
    RiUserLine, RiBookOpenLine, RiLogoutBoxRLine, RiSettings3Line, 
    RiBookReadLine, RiQuillPenLine, RiAddCircleLine 
} from 'react-icons/ri';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../contexts/AuthContext';

type UserLayoutProps = {
  children: ReactNode;
};

const UserLayout = ({ children }: UserLayoutProps) => {
  const router = useRouter();
  const { logout } = useAuth(); 

  const readerMenuItems = [
    { href: '/user/profile', label: 'Thông tin cá nhân', icon: <RiUserLine /> },
    { href: '/user/tu-sach', label: 'Tủ sách', icon: <RiBookOpenLine /> },
    { href: '/user/lich-su', label: 'Lịch sử đọc', icon: <RiBookReadLine /> },
    { href: '/user/cai-dat', label: 'Cài đặt', icon: <RiSettings3Line /> },
  ];

  // Menu dành cho việc sáng tác
  const creatorMenuItems = [
    { href: '/user/quan-ly-truyen', label: 'Quản lý truyện', icon: <RiQuillPenLine /> },
    { href: '/user/viet-truyen-moi', label: 'Viết truyện mới', icon: <RiAddCircleLine /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">

      <main className="container mx-auto px-4 py-12 md:py-16">
        <div className="md:flex md:gap-8">
          <aside className="w-full md:w-1/4 lg:w-1/5 mb-8 md:mb-0">
            <div className="sticky top-24 bg-white dark:bg-gray-800/50 backdrop-blur-md rounded-xl p-4 border border-gray-200 dark:border-gray-700/60 shadow-sm">
              {/* Menu Đọc giả */}
              <nav className="flex flex-col space-y-1">
                {readerMenuItems.map((item) => (
                  // SỬA LỖI: Xóa thẻ <a> và passHref, đưa props vào Link
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors duration-200 text-sm font-medium ${ router.pathname === item.href ? 'bg-indigo-600 text-white shadow-sm' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              {/* Phân tách */}
              <hr className="my-4 border-gray-200 dark:border-gray-700" />

              {/* Menu Sáng tác */}
              <h3 className="px-4 text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Sáng tác</h3>
              <nav className="flex flex-col space-y-1">
                 {creatorMenuItems.map((item) => (
                  // SỬA LỖI: Xóa thẻ <a> và passHref, đưa props vào Link
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors duration-200 text-sm font-medium ${ router.pathname === item.href ? 'bg-indigo-600 text-white shadow-sm' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              {/* Phân tách */}
              <hr className="my-4 border-gray-200 dark:border-gray-700" />
              
              {/* Đăng xuất */}
              <button onClick={logout} className="flex w-full items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors duration-200 text-sm font-medium text-red-500 hover:bg-red-500/10">
                <RiLogoutBoxRLine />
                <span>Đăng xuất</span>
              </button>
            </div>
          </aside>
          <div className="w-full md:w-3/4 lg:w-4/5">
            {children}
          </div>
        </div>
      </main>
     
    </div>
  );
};

export default UserLayout;