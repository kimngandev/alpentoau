'use client';

import React from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

type TruyenProps = {
  title: string;
  slug: string;
  description: string;
  cover: string;
  views: number;
};

export default function TruyenCard({ title, slug, description, cover, views }: TruyenProps) {
  // Sử dụng lại logic 3D tilt nhưng tinh chỉnh lại
  const x = useSpring(0, { stiffness: 300, damping: 30 });
  const y = useSpring(0, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(y, [-0.5, 0.5], ['15deg', '-15deg']);
  const rotateY = useTransform(x, [-0.5, 0.5], ['-15deg', '15deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
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
      className="group relative w-full aspect-[2/3] max-w-xs" // Kích thước như quyển sách
    >
      <Link href={`/truyen/${slug}`} className="block w-full h-full">
        <div
          style={{ transformStyle: 'preserve-3d' }}
          className="absolute inset-0 rounded-lg shadow-2xl shadow-purple-950/60"
        >
          {/* Lớp ánh sáng ma thuật, chỉ hiện ra khi hover */}
          <div
            className="
              absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500
              opacity-0 transition-opacity duration-500 group-hover:opacity-60
            "
            style={{ transform: 'translateZ(-1px)' }}
          />

          
          <motion.div
            style={{
              transformStyle: 'preserve-3d',
              transformOrigin: 'left center', 
            }}
            whileHover={{
              rotateY: -25, 
              scale: 1.05,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="relative w-full h-full rounded-lg overflow-hidden"
          >
            {/* Ảnh bìa */}
            <Image
              src={cover}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="w-full h-full object-cover"
            />

            {/* Lớp phủ gradient để làm nổi bật chữ */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />

            {/* Nội dung text */}
            <div className="absolute bottom-0 left-0 p-5 text-white w-full">
              <div
                className="
                  absolute top-[-55px] right-4 bg-black/50 backdrop-blur-sm px-3 py-1 
                  rounded-full text-xs flex items-center gap-1.5 transition-opacity 
                  opacity-0 group-hover:opacity-100 duration-300
                "
              >
                <i className="ri-eye-line"></i>
                <span>{views.toLocaleString()}</span>
              </div>
              <h2 className="font-bold text-xl drop-shadow-lg">{title}</h2>
            </div>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}