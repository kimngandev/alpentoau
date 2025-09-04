// frontend/components/AuthorLayout.tsx

import Link from 'next/link';
import { useRouter } from 'next/router';
import { RiBookReadLine, RiAddCircleLine, RiLogoutBoxRLine } from 'react-icons/ri';
import { useAuth } from '../contexts/AuthContext';

const AuthorSidebar = () => {
    const router = useRouter();
    const navLinks = [
        { href: '/tac-gia/truyen', label: 'Truyện của tôi', icon: <RiBookReadLine /> },
        { href: '/tac-gia/truyen/moi', label: 'Đăng truyện mới', icon: <RiAddCircleLine /> },
    ];

    return (
        <aside className="w-full lg:w-72 flex-shrink-0 bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Khu vực Tác giả</h2>
            <nav className="space-y-2">
                {navLinks.map(link => (
                    <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-semibold transition-colors ${router.pathname === link.href ? 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-white/10' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                        {link.icon} {link.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

const AuthorLayout = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center dark:bg-[#0b0418]">Đang tải...</div>;
    }
    
    // Logic kiểm tra vai trò 'writer' sẽ được thêm ở đây khi có API
    // if (!user || user.role !== 'writer') {
    //     router.push('/');
    //     return null;
    // }

    return (
        <div className="bg-gray-50 dark:bg-[#0b0418]">
            <div className="container mx-auto px-6 py-12 pt-24">
                <div className="flex flex-col lg:flex-row gap-8">
                    <AuthorSidebar />
                    <main className="flex-1 bg-white dark:bg-gray-900/50 p-8 rounded-lg shadow-md">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AuthorLayout;
