// frontend/components/AdminLayout.tsx

import Link from 'next/link';
import { useRouter } from 'next/router';
import { RiDashboardLine, RiBook2Line, RiUserLine, RiSettings3Line, RiLogoutBoxRLine } from 'react-icons/ri';
import { useAuth } from '../contexts/AuthContext';

const AdminSidebar = () => {
    const router = useRouter();
    const { logout } = useAuth();
    const navLinks = [
        { href: '/admin', label: 'Bảng điều khiển', icon: <RiDashboardLine /> },
        { href: '/admin/truyen', label: 'Quản lý truyện', icon: <RiBook2Line /> },
        { href: '/admin/users', label: 'Quản lý người dùng', icon: <RiUserLine /> },
    ];

    return (
        <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-900 p-4 flex flex-col border-r border-gray-200 dark:border-gray-800">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-8 text-center">Admin Panel</div>
            <nav className="flex-grow">
                <ul className="space-y-2">
                    {navLinks.map(link => (
                        <li key={link.href}>
                            <Link href={link.href} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-semibold transition-colors ${router.pathname === link.href ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                                {link.icon}
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div>
                <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                    <RiLogoutBoxRLine /> Đăng xuất
                </button>
            </div>
        </aside>
    );
};

const AdminLayout = ({ children }) => {
    // Thêm logic kiểm tra quyền admin ở đây
    return (
        <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900/95">
            <AdminSidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
