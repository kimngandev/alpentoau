// frontend/pages/user/lich-su.tsx

import React, { useState, useEffect } from 'react';
import UserLayout from '../../components/UserLayout';
import { useAuth } from '../../contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RiBookReadLine, RiArrowRightSLine, RiDeleteBin6Line, RiLoader4Line } from 'react-icons/ri';

// Kiểu dữ liệu cho một mục trong lịch sử đọc
type HistoryItem = {
  id: string;
  storySlug: string;
  storyTitle: string;
  cover: string;
  lastChapterRead: number;
  lastChapterTitle: string;
  lastReadAt: string; // ISO 8601 date string
};

// Dữ liệu giả lập - Thay thế bằng API thật
const mockHistory: HistoryItem[] = [
  {
    id: 'history1',
    storySlug: 'ma-dao-to-su',
    storyTitle: 'Ma Đạo Tổ Sư',
    cover: '/images/madaotosu.jpg',
    lastChapterRead: 110,
    lastChapterTitle: 'Vong Tiện',
    lastReadAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(), // 2 giờ trước
  },
  {
    id: 'history2',
    storySlug: 'thien-quan-tu-phuc',
    storyTitle: 'Thiên Quan Tứ Phúc',
    cover: '/images/thienquantuphuc.jpg', // Cần có ảnh này
    lastChapterRead: 240,
    lastChapterTitle: 'Hoa khai mãn thành',
    lastReadAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(), // Hôm qua
  },
   {
    id: 'history3',
    storySlug: 'toan-chuc-cao-thu',
    storyTitle: 'Toàn Chức Cao Thủ',
    cover: '/images/toanchuccothu.jpg', // Cần có ảnh này
    lastChapterRead: 1728,
    lastChapterTitle: 'Vinh Quang không bao giờ tàn',
    lastReadAt: new Date(Date.now() - 3600 * 1000 * 24 * 5).toISOString(), // 5 ngày trước
  },
];

// Hàm định dạng thời gian tương đối
const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " năm trước";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " tháng trước";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " ngày trước";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " giờ trước";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " phút trước";
    return "Vừa xong";
};

const ReadingHistoryPage = () => {
    const { user, loading: authLoading } = useAuth();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            // TODO: Gọi API để lấy lịch sử đọc của người dùng
            setTimeout(() => { // Giả lập thời gian chờ API
                setHistory(mockHistory);
                setIsLoading(false);
            }, 1000);
        } else if (!authLoading) {
            setIsLoading(false);
        }
    }, [user, authLoading]);

    const handleRemoveItem = (itemId: string) => {
        setHistory(prev => prev.filter(item => item.id !== itemId));
    };

    const handleClearHistory = () => {
        setHistory([]);
    }

    if (authLoading || isLoading) {
        return (
            <UserLayout>
                <div className="flex justify-center items-center h-64">
                    <RiLoader4Line className="animate-spin text-4xl text-indigo-500" />
                </div>
            </UserLayout>
        );
    }
    
    if (!user) {
         return <UserLayout><div>Vui lòng <Link href="/login" className="text-indigo-500">đăng nhập</Link> để xem trang này.</div></UserLayout>;
    }

    return (
        <UserLayout>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                        <RiBookReadLine className="text-indigo-500"/>
                        Lịch sử đọc
                    </h1>
                    {history.length > 0 && (
                        <button 
                            onClick={handleClearHistory}
                            className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
                        >
                            <RiDeleteBin6Line/> Xóa tất cả
                        </button>
                    )}
                </div>

                <div className="bg-white dark:bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-200 dark:border-gray-700/60 shadow-sm">
                    {history.length > 0 ? (
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700/60">
                            {history.map((item, index) => (
                                <motion.li
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="p-4 flex items-center space-x-4 group"
                                >
                                    {/* SỬA LỖI 1 */}
                                    <Link href={`/truyen/${item.storySlug}`} className="flex-shrink-0">
                                        <Image 
                                            src={item.cover}
                                            alt={item.storyTitle}
                                            width={64}
                                            height={96}
                                            className="rounded-md object-cover w-16 h-24"
                                        />
                                    </Link>
                                    <div className="flex-grow">
                                        {/* SỬA LỖI 2 */}
                                        <Link href={`/truyen/${item.storySlug}`} className="font-bold text-lg hover:text-indigo-500 transition-colors">
                                            {item.storyTitle}
                                        </Link>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            Đã đọc đến {/* SỬA LỖI 3 */}
                                            <Link href={`/chuong/${item.storySlug}-chuong-${item.lastChapterRead}`} className="font-semibold text-indigo-500 hover:underline">
                                                Chương {item.lastChapterRead}
                                            </Link>
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{formatTimeAgo(item.lastReadAt)}</p>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {/* SỬA LỖI 4 */}
                                        <Link href={`/chuong/${item.storySlug}-chuong-${item.lastChapterRead}`} className="px-3 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-1">
                                            Đọc tiếp <RiArrowRightSLine/>
                                        </Link>
                                        <button 
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-500 rounded-full transition"
                                            aria-label="Xóa khỏi lịch sử"
                                        >
                                            <RiDeleteBin6Line size={18}/>
                                        </button>
                                    </div>
                                </motion.li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-16 px-6">
                            <h3 className="text-xl font-semibold">Lịch sử đọc của bạn trống</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">Hãy bắt đầu khám phá những câu chuyện kỳ thú!</p>
                            {/* SỬA LỖI 5 */}
                            <Link href="/" className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2.5 font-semibold rounded-lg hover:bg-indigo-700 shadow-sm transition">
                                Tìm truyện ngay
                            </Link>
                        </div>
                    )}
                </div>
            </motion.div>
        </UserLayout>
    );
};

export default ReadingHistoryPage;