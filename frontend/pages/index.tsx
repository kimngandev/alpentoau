// frontend/pages/index.tsx
import { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import Header from '../components/Header'
import Footer from '../components/Footer'

import Hero from '../components/Hero'
import FilterBar from '../components/FilterBar'
import TruyenCard from '../components/TruyenCard'
import PopupAd from '../components/PopupAd'
import storiesData from '../data/stories.json'

type Story = { id: number; title: string; slug: string; description: string; cover: string; views: number }

export default function HomePage() {
  const { t } = useTranslation('common')
  const [stories, setStories] = useState<Story[]>([])
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    setStories(storiesData)
  }, [])

  const filtered = stories.filter(s =>
    s.title.toLowerCase().includes(keyword.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0418] transition-colors">
      <Hero />
      <main id="stories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <FilterBar keyword={keyword} onChange={setKeyword} />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
          {filtered.map(story => (
            <div key={story.id} className="flex justify-center">
              <TruyenCard {...story} />
            </div>
          ))}
        </div>
      </main>
      
   
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'vi', ['common'])),
    },
  }
}
