// frontend/components/TruyenCard.tsx

'use client';

import React from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { RiBookmarkLine, RiEyeLine } from 'react-icons/ri';

type TruyenProps = {
  title: string;
  slug: string;
  description: string;
  cover: string;
  views: number;
};

export default function TruyenCard({ title, slug, description, cover, views }: TruyenProps) {
  // --- ANIMATION ---
  // Giảm độ "cứng" và tăng độ "giảm chấn" để chuyển động mượt hơn
  const x = useSpring(0, { stiffness: 200, damping: 40 });
  const y = useSpring(0, { stiffness: 200, damping: 40 });

  // Giảm góc xoay để hiệu ứng nhẹ nhàng hơn
  const rotateX = useTransform(y, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(x, [-0.5, 0.5], ['-8deg', '8deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleBookmarkClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    alert(`Đã lưu truyện "${title}" vào tủ sách!`);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className="group relative w-full aspect-[2/3] max-w-xs"
    >
      <div
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-full rounded-xl shadow-lg shadow-black/30 group-hover:shadow-2xl group-hover:shadow-indigo-900/50 transition-shadow duration-500"
      >
        {/* Lớp chứa ảnh bìa và thông tin */}
        <div style={{ transform: 'translateZ(0px)' }} className="relative w-full h-full rounded-xl overflow-hidden">
          <Image
            src={cover}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" // Giảm độ phóng to ảnh
          />
          {/* Lớp gradient tối ở chân card */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        {/* LỚP ÁNH SÁNG VIỀN - Tinh tế và dịu mắt hơn */}
        <div
          className="pointer-events-none absolute inset-0 rounded-xl border-2 border-transparent transition-all duration-500 group-hover:border-indigo-400/50"
          style={{ transform: 'translateZ(10px)' }}
        />

        {/* LỚP HIỂN THỊ THÔNG TIN */}
        <div
          className="absolute bottom-0 left-0 p-4 text-white w-full"
          style={{ transform: 'translateZ(20px)' }} // Đẩy text ra phía trước
        >
          <h2 className="font-bold text-xl drop-shadow-md leading-tight">{title}</h2>
        </div>

        {/* LƯỢT XEM (VIEWS) */}
        <div
          style={{ transform: 'translateZ(30px)' }}
          className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full text-xs flex items-center gap-1.5 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        >
          <RiEyeLine />
          <span>{views.toLocaleString()}</span>
        </div>
      </div>
      
      {/* NÚT BOOKMARK */}
      <motion.button
        onClick={handleBookmarkClick}
        style={{ transform: 'translateZ(40px)' }} // Đẩy nút ra ngoài cùng
        className="absolute top-3 left-3 w-9 h-9 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-full text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-indigo-600"
        aria-label="Lưu vào tủ sách"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <RiBookmarkLine />
      </motion.button>
    </motion.div>
  );
}