// components/CosmicBackground.jsx
'use client';
import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

// Tạo một vì sao ngẫu nhiên
const Star = ({ initialX, initialY, size, duration }) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      x: [initialX, initialX + 50, initialX - 50, initialX],
      y: [initialY, initialY + 50, initialY - 50, initialY],
      opacity: [0, 1, 0.8, 0],
      transition: {
        duration: duration,
        repeat: Infinity,
        ease: 'linear',
      },
    });
  }, [controls, initialX, initialY, duration]);

  return (
    <motion.circle
      cx={initialX}
      cy={initialY}
      r={size}
      fill="white"
      initial={{ opacity: 0 }}
      animate={controls}
    />
  );
};

export default function CosmicBackground() {
  const [stars, setStars] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Tạo ra các vì sao khi component được mount
  useEffect(() => {
    const generateStars = () => {
      const newStars = Array.from({ length: 150 }, () => ({
        id: Math.random(),
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 1.5 + 0.5,
        duration: Math.random() * 20 + 10, // Mỗi sao có tốc độ khác nhau
      }));
      setStars(newStars);
    };

    generateStars();
    window.addEventListener('resize', generateStars); // Tái tạo sao khi resize

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', generateStars);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Nền Gradient Tím Đậm */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0c2e] via-[#2a144f] to-[#0f071a]" />

      {/* Các tinh vân (Nebula) màu tím và hồng */}
      <motion.div
        className="absolute top-[-20%] left-[-20%] h-[60%] w-[60%] rounded-full bg-purple-600/20 blur-[120px]"
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 30, repeat: Infinity, repeatType: 'mirror' }}
      />
      <motion.div
        className="absolute bottom-[-20%] right-[-20%] h-[50%] w-[50%] rounded-full bg-pink-500/15 blur-[100px]"
        animate={{ scale: [1, 1.05, 1], rotate: [0, -5, 0] }}
        transition={{ duration: 40, repeat: Infinity, repeatType: 'mirror' }}
      />

      {/* Hiệu ứng ánh sáng đi theo con trỏ chuột */}
      <motion.div
        className="absolute h-96 w-96 rounded-full bg-white/5 blur-[80px]"
        animate={{ x: mousePosition.x - 192, y: mousePosition.y - 192 }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.5 }}
      />

      {/* SVG chứa các vì sao */}
      <svg className="absolute inset-0 h-full w-full">
        {stars.map((star) => (
          <Star
            key={star.id}
            initialX={star.x}
            initialY={star.y}
            size={star.size}
            duration={star.duration}
          />
        ))}
      </svg>
    </div>
  );
}