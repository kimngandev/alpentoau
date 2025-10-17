// frontend/pages/user/cai-dat.tsx

import React, { useState, useEffect } from 'react';
import UserLayout from '../../components/UserLayout';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { RiNotification3Line, RiShieldKeyholeLine, RiUserUnfollowLine, RiPaletteLine } from 'react-icons/ri';

// Component Switch tùy chỉnh
const SettingSwitch = ({ id, label, description, checked, onChange }: { id: string, label: string, description: string, checked: boolean, onChange: (checked: boolean) => void }) => (
    <div className="flex items-center justify-between py-4">
        <div className="flex-grow">
            <label htmlFor={id} className="font-medium text-gray-800 dark:text-gray-200 cursor-pointer">{label}</label>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
            <input
                type="checkbox"
                name={id}
                id={id}
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
            />
            <label htmlFor={id} className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer"></label>
        </div>
    </div>
);

// Dữ liệu cài đặt giả lập
const mockUserSettings = {
    notifications: {
        newChapter: true,
        comments: false,
        offers: true,
    },
    theme: 'system', // 'light', 'dark', 'system'
};


const UserSettingsPage = () => {
    const { user, loading } = useAuth();
    const [settings, setSettings] = useState(mockUserSettings);

    useEffect(() => {
        if (user) {
            // TODO: Lấy cài đặt của người dùng từ API và set vào state
            // setSettings(user.settings); 
        }
    }, [user]);

    const handleSettingChange = (category: string, key: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...(prev as any)[category],
                [key]: value,
            }
        }));
    };

    const handleSaveSettings = () => {
        // TODO: Gọi API để lưu cài đặt
        console.log("Đang lưu cài đặt:", settings);
        alert("Cài đặt đã được lưu!");
    };
    
    if (loading) {
        return <UserLayout><div>Đang tải...</div></UserLayout>;
    }
    
    if (!user) {
         return <UserLayout><div>Vui lòng <a href="/login" className="text-indigo-500">đăng nhập</a> để xem trang này.</div></UserLayout>;
    }

    return (
        <UserLayout>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                {/* Phần Cài đặt Giao diện */}
                <div className="bg-white dark:bg-gray-800/50 backdrop-blur-md rounded-xl p-6 md:p-8 border border-gray-200 dark:border-gray-700/60 shadow-sm">
                    <h2 className="text-xl font-bold flex items-center gap-3 mb-4">
                        <RiPaletteLine className="text-indigo-500"/>
                        Giao diện
                    </h2>
                    <div className='border-t border-gray-200 dark:border-gray-700 pt-4'>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Chọn chế độ hiển thị màu sắc cho trang web.</p>
                        <div className="flex flex-wrap gap-4">
                           {['light', 'dark', 'system'].map((theme) => (
                               <button
                                   key={theme}
                                   onClick={() => handleSettingChange('theme', '', theme)}
                                   className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${settings.theme === theme ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                               >
                                   {theme === 'light' ? 'Sáng' : theme === 'dark' ? 'Tối' : 'Hệ thống'}
                               </button>
                           ))}
                        </div>
                    </div>
                </div>

                {/* Phần Cài đặt Thông báo */}
                <div className="bg-white dark:bg-gray-800/50 backdrop-blur-md rounded-xl p-6 md:p-8 border border-gray-200 dark:border-gray-700/60 shadow-sm">
                    <h2 className="text-xl font-bold flex items-center gap-3 mb-4">
                        <RiNotification3Line className="text-indigo-500"/>
                        Thông báo
                    </h2>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        <SettingSwitch 
                            id="newChapter"
                            label="Chương mới"
                            description="Nhận thông báo khi truyện bạn theo dõi có chương mới."
                            checked={settings.notifications.newChapter}
                            onChange={(checked) => handleSettingChange('notifications', 'newChapter', checked)}
                        />
                         <SettingSwitch 
                            id="comments"
                            label="Phản hồi bình luận"
                            description="Nhận thông báo khi có người trả lời bình luận của bạn."
                            checked={settings.notifications.comments}
                            onChange={(checked) => handleSettingChange('notifications', 'comments', checked)}
                        />
                         <SettingSwitch 
                            id="offers"
                            label="Ưu đãi & Tin tức"
                            description="Nhận thông tin về các ưu đãi đặc biệt và tin tức từ chúng tôi."
                            checked={settings.notifications.offers}
                            onChange={(checked) => handleSettingChange('notifications', 'offers', checked)}
                        />
                    </div>
                </div>

                {/* Phần Cài đặt Tài khoản */}
                <div className="bg-white dark:bg-gray-800/50 backdrop-blur-md rounded-xl p-6 md:p-8 border border-gray-200 dark:border-gray-700/60 shadow-sm">
                    <h2 className="text-xl font-bold flex items-center gap-3 mb-4">
                        <RiShieldKeyholeLine className="text-indigo-500"/>
                        Tài khoản & Bảo mật
                    </h2>
                     <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
                        <button className="w-full sm:w-auto text-center px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200">
                            Đổi mật khẩu
                        </button>
                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                           <h3 className="font-semibold text-red-600 dark:text-red-400 flex items-center gap-2"><RiUserUnfollowLine /> Xóa tài khoản</h3>
                           <p className="text-sm text-red-500 dark:text-red-300/80 mt-1">Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.</p>
                           <button className="mt-3 px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                               Yêu cầu xóa tài khoản
                           </button>
                        </div>
                    </div>
                </div>

                {/* Nút Lưu */}
                <div className="flex justify-end pt-4">
                    <button 
                        onClick={handleSaveSettings}
                        className="bg-indigo-600 text-white px-8 py-2.5 font-semibold rounded-lg hover:bg-indigo-700 shadow-sm transition duration-200"
                    >
                        Lưu Cài đặt
                    </button>
                </div>
            </motion.div>
        </UserLayout>
    );
};

export default UserSettingsPage;