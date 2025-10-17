// frontend/pages/user/profile.tsx

import React, { useState, useEffect, useRef } from 'react';
import UserLayout from '../../components/UserLayout';
import Image from 'next/image';
import { RiCamera3Line, RiMailLine, RiUser3Line } from 'react-icons/ri';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const getRandomName = () => {
    const adjectives = ['Lãng Tử', 'Vô Danh', 'Ẩn Sĩ', 'Độc Cô', 'Phiêu Bồng'];
    const nouns = ['Kiếm Khách', 'Đạo Nhân', 'Thư Sinh', 'Hành Giả', 'Tu Sĩ'];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adjective} ${noun}`;
};

const UserProfilePage = () => {
    const { user, loading } = useAuth();
    const [displayName, setDisplayName] = useState('');
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            setDisplayName(user.name || getRandomName());
            setAvatarPreview(user.avatar || '/images/default-avatar.png'); 
        }
    }, [user]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        alert(`Thông tin đã được cập nhật!\nTên mới: ${displayName}`);
    };
    
    if (loading) {
        return <UserLayout><div>Đang tải thông tin...</div></UserLayout>;
    }
    
    if (!user) {
         return <UserLayout><div>Vui lòng <a href="/login" className="text-indigo-500">đăng nhập</a> để xem trang này.</div></UserLayout>;
    }

    return (
        <UserLayout>
            <div className="space-y-6">
                {/* Profile Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    // TỐI ƯU: Giảm padding trên mobile
                    className="bg-white dark:bg-gray-800/50 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700/60 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 shadow-sm"
                >
                    <div className="relative group cursor-pointer" onClick={handleImageClick}>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleAvatarChange}
                            accept="image/png, image/jpeg, image/webp"
                            className="hidden"
                        />
                        <Image
                            src={avatarPreview || '/images/default-avatar.png'}
                            alt="User Avatar"
                            width={100}
                            height={100}
                            // TỐI ƯU: Giảm kích thước avatar trên mobile
                            className="rounded-full border-4 border-gray-200 dark:border-gray-600 object-cover w-20 h-20 sm:w-24 sm:h-24"
                        />
                        <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <RiCamera3Line />
                        </div>
                    </div>
                    <div className="text-center sm:text-left">
                        {/* TỐI ƯU: Giảm kích thước font chữ trên mobile */}
                        <h1 className="text-2xl sm:text-3xl font-bold">{displayName}</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Tham gia ngày {new Date(user.createdAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                </motion.div>

                {/* Profile Details Form */}
                <motion.form 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleSaveChanges} 
                    // TỐI ƯU: Giảm padding trên mobile
                    className="bg-white dark:bg-gray-800/50 backdrop-blur-md rounded-xl p-4 sm:p-8 border border-gray-200 dark:border-gray-700/60 space-y-6 shadow-sm"
                >
                    <h2 className="text-xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-3">Chỉnh sửa thông tin</h2>
                    
                    {/* TỐI ƯU: Bỏ grid trên mobile, các input sẽ tự xếp chồng */}
                    <div className="flex flex-col md:grid md:grid-cols-2 gap-6">
                        {/* Tên hiển thị */}
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">Tên hiển thị</label>
                            <div className="relative">
                                <RiUser3Line className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    placeholder="Nhập tên của bạn"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">Địa chỉ Email</label>
                            <div className="relative">
                                <RiMailLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={user.email}
                                    disabled
                                    className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 pl-10 pr-4 cursor-not-allowed opacity-70"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* TỐI ƯU: Các nút sẽ luôn xếp chồng trên mobile cho dễ bấm */}
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
                        <button type="button" className="w-full sm:w-auto text-center px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200">
                            Đổi mật khẩu
                        </button>
                        <button type="submit" className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-2.5 font-semibold rounded-lg hover:bg-indigo-700 shadow-sm transition duration-200">
                            Lưu thay đổi
                        </button>
                    </div>
                </motion.form>
            </div>
        </UserLayout>
    );
};

export default UserProfilePage;