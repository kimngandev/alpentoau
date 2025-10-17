// frontend/pages/user/viet-truyen-moi.tsx

import React, { useState } from 'react';
import UserLayout from '../../components/UserLayout'; // Sử dụng UserLayout
import { motion } from 'framer-motion';
import { RiAddCircleLine, RiBook2Line, RiImageAddLine } from 'react-icons/ri';

const NewUserStoryPage = () => {
    const [coverPreview, setCoverPreview] = useState<string | null>(null);

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setCoverPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <UserLayout>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3 mb-6">
                    <RiAddCircleLine className="text-indigo-500"/>
                    Bắt đầu câu chuyện của bạn
                </h1>

                <form className="space-y-6 bg-white dark:bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-200 dark:border-gray-700/60 shadow-sm p-8">
                    {/* Tên truyện */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-1">Tên truyện</label>
                        <div className="relative">
                            <RiBook2Line className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                            <input type="text" id="title" className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500" placeholder="Một cái tên thật kêu..." required/>
                        </div>
                    </div>

                     {/* Giới thiệu */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium mb-1">Giới thiệu (Synopsis)</label>
                         <textarea id="description" rows={6} className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500" placeholder="Viết một đoạn giới thiệu hấp dẫn về câu chuyện của bạn..." required></textarea>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                         {/* Ảnh bìa */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Ảnh bìa</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    {coverPreview ? (
                                        <img src={coverPreview} alt="Xem trước ảnh bìa" className="mx-auto h-48 w-auto rounded-md object-contain"/>
                                    ) : (
                                        <RiImageAddLine className="mx-auto h-12 w-12 text-gray-400"/>
                                    )}
                                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                        <label htmlFor="cover-upload" className="relative cursor-pointer rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                                            <span>Tải ảnh lên</span>
                                            <input id="cover-upload" name="cover-upload" type="file" className="sr-only" accept="image/*" onChange={handleCoverChange}/>
                                        </label>
                                        <p className="pl-1">hoặc kéo thả</p>
                                    </div>
                                    <p className="text-xs text-gray-500">Kích thước đề xuất: 600x900px</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className='space-y-6'>
                            {/* Thể loại */}
                            <div>
                                <label htmlFor="genres" className="block text-sm font-medium mb-1">Thể loại</label>
                                <input type="text" id="genres" className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-indigo-500" placeholder="Ví dụ: Lãng mạn, Hài hước, Kinh dị"/>
                                <p className="text-xs text-gray-500 mt-1">Các thể loại cách nhau bởi dấu phẩy (,)</p>
                            </div>
                            {/* Tình trạng */}
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium mb-1">Tình trạng</label>
                                <select id="status" className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-indigo-500">
                                    <option>Đang ra</option>
                                    <option>Hoàn thành</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                         <button type="submit" className="bg-indigo-600 text-white px-8 py-2.5 font-semibold rounded-lg hover:bg-indigo-700 shadow-sm transition">
                            Tạo truyện và viết chương đầu
                        </button>
                    </div>
                </form>
            </motion.div>
        </UserLayout>
    )
}

export default NewUserStoryPage;