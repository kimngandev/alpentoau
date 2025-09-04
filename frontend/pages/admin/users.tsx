// frontend/pages/admin/users.tsx

import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AdminLayout from '../../components/AdminLayout';
import { RiUserFollowLine, RiUserForbidLine } from 'react-icons/ri';

// Dữ liệu người dùng giả
const users = [
    { id: 1, name: 'User 1', email: 'user1@email.com', role: 'user', status: 'active' },
    { id: 2, name: 'Tác giả A', email: 'authorA@email.com', role: 'writer', status: 'active' },
    { id: 3, name: 'User 3', email: 'user3@email.com', role: 'user', status: 'banned' },
];

export default function AdminUsersPage() {
    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Quản lý Người dùng</h1>
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
                 <table className="w-full text-left">
                    <thead className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="p-4">Tên</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Vai trò</th>
                            <th className="p-4">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="p-4 font-semibold">{user.name}</td>
                                <td className="p-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                                <td className="p-4">
                                    <select defaultValue={user.role} className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-1">
                                        <option value="user">User</option>
                                        <option value="writer">Writer</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="p-4 flex gap-3">
                                    {user.status === 'active' ? (
                                        <button className="text-red-500 hover:text-red-700"><RiUserForbidLine title="Cấm" /></button>
                                    ) : (
                                        <button className="text-green-500 hover:text-green-700"><RiUserFollowLine title="Bỏ cấm" /></button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: { ...(await serverSideTranslations(locale ?? 'vi', ['common'])) },
});
