'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// 1. Tạo đối tượng chứa nội dung đa ngôn ngữ
const translations = {
  vi: {
    description: "Cánh cổng dẫn đến vô vàn thế giới truyện, nơi trí tưởng tượng không có giới hạn.",
    links: {
      title: "Khám phá",
      about: "Giới thiệu",
      contact: "Liên hệ",
      policy: "Chính sách",
      stories: "Truyện",
    },
    social: "Kết nối với chúng tôi",
    copyright: `© ${new Date().getFullYear()} Alpentou. Bảo lưu mọi quyền.`,
  },
  en: {
    description: "The gateway to countless story worlds, where imagination knows no bounds.",
    links: {
      title: "Explore",
      about: "About Us",
      contact: "Contact",
      policy: "Policy",
      stories: "Stories",
    },
    social: "Connect with us",
    copyright: `© ${new Date().getFullYear()} Alpentou. All rights reserved.`,
  },
};

export default function Footer() {
  // 2. State và Effect để xử lý đa ngôn ngữ
  const [lang, setLang] = React.useState<'vi' | 'en'>('vi');

  React.useEffect(() => {
    // Chỉ chạy ở phía client
    if (typeof window !== 'undefined') {
      const browserLang = navigator.language.slice(0, 2);
      if (browserLang !== 'vi') {
        setLang('en');
      }
    }
  }, []);

  const content = translations[lang];

  return (
    <footer className="relative bg-[#0f071a] text-gray-300 pt-16 pb-8 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 opacity-50" />

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Cột 1: Logo và Mô tả */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <Image src="/images/logo.PNG" alt="Alpentou Logo" width={40} height={40} />
              <span className="text-2xl font-bold text-white">Alpentou</span>
            </Link>
            <p className="text-sm max-w-md">{content.description}</p>
          </div>

          {/* Cột 2: Các liên kết */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{content.links.title}</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="hover:text-purple-400 transition-colors">{content.links.about}</Link></li>
              <li><Link href="/contact" className="hover:text-purple-400 transition-colors">{content.links.contact}</Link></li>
              <li><Link href="/policy" className="hover:text-purple-400 transition-colors">{content.links.policy}</Link></li>
              <li><Link href="/stories" className="hover:text-purple-400 transition-colors">{content.links.stories}</Link></li>
            </ul>
          </div>

          {/* Cột 3: Mạng xã hội */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{content.social}</h3>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-2xl hover:text-pink-500 transition-colors"><i className="ri-facebook-box-fill"></i></a>
              <a href="#" aria-label="Twitter" className="text-2xl hover:text-pink-500 transition-colors"><i className="ri-twitter-x-fill"></i></a>
              <a href="#" aria-label="Instagram" className="text-2xl hover:text-pink-500 transition-colors"><i className="ri-instagram-line"></i></a>
            </div>
          </div>
        </div>

        {/* Dòng Copyright ở cuối */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm">
          <p>{content.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
