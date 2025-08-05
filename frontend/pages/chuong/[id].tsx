import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import Header from '../../components/Header'

// Dữ liệu ảo cho chương
const fakeChapters = [
  {
    id: 1,
    storyId: 2,
    title: 'Chương 1: Khởi đầu',
    content: 'Đây là nội dung chương đầu tiên của Ma Đạo Tổ Sư. Nội dung chỉ là demo.'
  },
  {
    id: 2,
    storyId: 2,
    title: 'Chương 2: Bí mật',
    content: 'Nội dung chương 2 tiếp theo... (demo)'
  }
]

export default function ChapterPage() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { id } = router.query
  const [chapter, setChapter] = useState<any>(null)

  useEffect(() => {
    if (id) {
      const found = fakeChapters.find(ch => ch.id === Number(id))
      setChapter(found || null)
    }
  }, [id])

  const currentIndex = fakeChapters.findIndex(ch => ch.id === Number(id))
  const prevChapter = fakeChapters[currentIndex - 1]
  const nextChapter = fakeChapters[currentIndex + 1]

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        {chapter ? (
          <>
            <h1 className="text-2xl font-bold mb-4">{chapter.title}</h1>
            <article className="prose max-w-none text-gray-800 whitespace-pre-line">
              {chapter.content}
            </article>

            <div className="mt-8 flex justify-between">
              {prevChapter ? (
                <Link
                  href={`/chuong/${prevChapter.id}`}
                  className="text-blue-600 hover:underline"
                >
                  ← {prevChapter.title}
                </Link>
              ) : <span />}

              {nextChapter ? (
                <Link
                  href={`/chuong/${nextChapter.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {nextChapter.title} →
                </Link>
              ) : <span />}
            </div>
          </>
        ) : (
          <p>{t('loading')}</p>
        )}
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
