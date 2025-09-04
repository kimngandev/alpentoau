// frontend/pages/tac-gia/truyen.tsx

import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AuthorLayout from '../../components/AuthorLayout';
import Link from 'next/link';
import { RiEdit2Line, RiDeleteBinLine, RiAddLine } from 'react-icons/ri';
import stories from '../../data/stories.json';

// Dữ liệu giả truyện của tác giả
const authorStories = stories.slice(0, 2);

export default function AuthorStoriesPage() {
    return (
        <AuthorLayout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Truyện của tôi</h1>
                <Link href="/tac-gia/truyen/moi" className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700">
                    <RiAddLine /> Đăng truyện mới
                </Link>
            </div>
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg">
                <table className="w-full text-left">
                    <thead className="border-b dark:border-gray-700">
                        <tr>
                            <th className="p-4">Tên truyện</th>
                            <th className="p-4">Lượt xem</th>
                            <th className="p-4">Trạng thái</th>
                            <th className="p-4">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {authorStories.map(story => (
                            <tr key={story.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="p-4 font-semibold">{story.title}</td>
                                <td className="p-4">{story.views.toLocaleString()}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                        Đã duyệt
                                    </span>
                                </td>
                                <td className="p-4 flex gap-2">
                                    <button className="text-blue-500 hover:text-blue-700"><RiEdit2Line /></button>
                                    <button className="text-red-500 hover:text-red-700"><RiDeleteBinLine /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AuthorLayout>
    );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: { ...(await serverSideTranslations(locale ?? 'vi', ['common'])) },
});
