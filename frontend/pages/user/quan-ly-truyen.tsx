// frontend/pages/user/quan-ly-truyen.tsx

import React, { useState } from 'react';
import UserLayout from '../../components/UserLayout'; // Sử dụng UserLayout
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RiQuillPenLine, RiAddCircleLine, RiEdit2Line, RiDeleteBin6Line, RiFileList3Line } from 'react-icons/ri';

// Dữ liệu giả lập
const mockUserStories = [
    { id: '1', title: 'Hành Trình Vô Tận', cover: '/images/madaotosu.jpg', status: 'Đang ra', chapters: 120, views: 1500000 },
    { id: '2', title: 'Kiếm Sĩ Bất Đắc Dĩ', cover: '/images/thienquantuphuc.jpg', status: 'Hoàn thành', chapters: 250, views: 3200000 },
];

const ManageUserStoriesPage = () => {
    const [stories, setStories] = useState(mockUserStories);

    return (
        <UserLayout>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                        <RiQuillPenLine className="text-indigo-500"/>
                        Truyện của tôi
                    </h1>
                    {/* SỬA LỖI: Xóa thẻ <a> và passHref, đưa props vào Link */}
                    <Link 
                        href="/user/viet-truyen-moi"
                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 font-semibold rounded-lg hover:bg-indigo-700 shadow-sm transition"
                    >
                        <RiAddCircleLine/> Viết truyện mới
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-200 dark:border-gray-700/60 shadow-sm overflow-hidden">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700/60">
                        {stories.length > 0 ? stories.map(story => (
                            <li key={story.id} className="p-4 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                                <Image src={story.cover} alt={story.title} width={80} height={120} className="rounded-md object-cover w-20 h-30 flex-shrink-0"/>
                                <div className="flex-grow text-center md:text-left">
                                    <h2 className="font-bold text-lg">{story.title}</h2>
                                    <div className="flex justify-center md:justify-start items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        <span>{story.chapters} chương</span>
                                        <span>{story.views.toLocaleString()} lượt đọc</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${story.status === 'Đang ra' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'}`}>
                                            {story.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button className="p-2 text-gray-500 hover:text-green-500 transition" title="Quản lý chương"><RiFileList3Line size={20}/></button>
                                    <button className="p-2 text-gray-500 hover:text-blue-500 transition" title="Chỉnh sửa truyện"><RiEdit2Line size={20}/></button>
                                    <button className="p-2 text-gray-500 hover:text-red-500 transition" title="Xóa truyện"><RiDeleteBin6Line size={20}/></button>
                                </div>
                            </li>
                        )) : (
                            <p className="p-8 text-center text-gray-500">Bạn chưa có truyện nào. Hãy bắt đầu viết ngay!</p>
                        )}
                    </ul>
                </div>
            </motion.div>
        </UserLayout>
    );
};

export default ManageUserStoriesPage;