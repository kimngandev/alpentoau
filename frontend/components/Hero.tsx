// frontend/components/Hero.tsx
'use client';

import React from 'react'
import { motion } from 'framer-motion'
import CosmicBackground from './CosmicBackground'
import WaveDivider from './WaveDivider'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

export default function Hero() {
  const { t } = useTranslation('common')
  const { locale } = useRouter()
 
  const title      = t('hero.title')
  const subtitle   = t('hero.subtitle')
  const buttonText = t('hero.buttonText')

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center text-center overflow-hidden">
      <CosmicBackground />

      <motion.div
        className="relative z-20 flex flex-col items-center max-w-5xl w-full px-6 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, staggerChildren: 0.2 }}
      >
        <motion.h1
          key={`${locale}-title`}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 text-transparent bg-clip-text 
                     bg-gradient-to-b from-gray-50 to-gray-300 drop-shadow-lg leading-tight"
        >
          {title}
        </motion.h1>

        <motion.p
          key={`${locale}-subtitle`}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base md:text-lg lg:text-xl mb-10 text-gray-300 drop-shadow-md max-w-3xl leading-relaxed"
        >
          {subtitle}
        </motion.p>
        
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <button
            className="
              relative group font-bold text-lg text-white px-8 py-4 rounded-full
              bg-white/10 border border-white/20 backdrop-blur-md overflow-hidden
              transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50
              hover:scale-105 transform
            "
          >
            <span className="relative z-10">{buttonText}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </motion.div>
      </motion.div>

      <WaveDivider />
    </section>
  )
}
