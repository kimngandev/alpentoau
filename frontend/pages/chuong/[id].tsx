import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { FiChevronLeft, FiChevronRight, FiHome } from 'react-icons/fi'

// --- Định nghĩa kiểu dữ liệu ---
interface Chapter {
  id: number;
  storyId: number;
  title: string;
  content: string;
  storyTitle?: string; 
  storySlug?: string;
}

// Bổ sung: Interface cho truyện được gợi ý
interface Story {
  id: number;
  title: string;
  slug: string;
  imageUrl: string;
}

// --- Dữ liệu giả ---
const fakeChapters: Chapter[] = [
  {
    id: 1,
    storyId: 2,
    title: 'Chương 1: Khởi đầu',
    content: 'Đây là nội dung chương đầu tiên của Ma Đạo Tổ Sư.\nNội dung chỉ là demo để cho thấy khả năng xuống dòng của văn bản.\n\nĐoạn văn mới sẽ được hiển thị như thế này.',
    storyTitle: 'Ma Đạo Tổ Sư',
    storySlug: 'ma-dao-to-su'
  },
  {
    id: 2,
    storyId: 2,
    title: 'Chương 2: Bí mật',
    content: 'Nội dung chương 2 tiếp theo...\n\n(demo)',
    storyTitle: 'Ma Đạo Tổ Sư',
    storySlug: 'ma-dao-to-su'
  },
  {
    id: 3,
    storyId: 2,
    title: 'Chương 3: Gặp gỡ',
    content: 'Nội dung chương 3... (demo)',
    storyTitle: 'Ma Đạo Tổ Sư',
    storySlug: 'ma-dao-to-su'
  }
]

// Bổ sung: Dữ liệu giả cho các truyện được gợi ý
const fakeSuggestedStories: Story[] = [
  {
    id: 1,
    title: 'Thám Tử Lừng Danh Conan',
    slug: 'tham-tu-lung-danh-conan',
    imageUrl: 'https://placehold.co/300x400/6366f1/white?text=Conan',
  },
  {
    id: 3,
    title: 'One Piece',
    slug: 'one-piece',
    imageUrl: 'https://placehold.co/300x400/ec4899/white?text=One+Piece',
  },
  {
    id: 4,
    title: 'Doraemon',
    slug: 'doraemon',
    imageUrl: 'https://placehold.co/300x400/f97316/white?text=Doraemon',
  },
   {
    id: 5,
    title: 'Naruto',
    slug: 'naruto',
    imageUrl: 'https://placehold.co/300x400/84cc16/white?text=Naruto',
  },
];


// --- Components ---
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
  </div>
)

// Bổ sung: Component Footer mới
const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">
                    Có thể bạn cũng thích
                </h2>
                {/* Phần gợi ý truyện */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
                    {fakeSuggestedStories.map((story) => (
                        <Link key={story.id} href={`/truyen/${story.slug}`} className="group text-center">
                            <div className="aspect-[3/4] w-full overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow">
                                <img
                                    src={story.imageUrl}
                                    alt={`Bìa truyện ${story.title}`}
                                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/300x400/ccc/fff?text=Error'; }}
                                />
                            </div>
                            <h3 className="mt-3 text-md font-semibold text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {story.title}
                            </h3>
                        </Link>
                    ))}
                </div>
                 {/* Phần Copyright */}
                <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-8">
                    <p>&copy; {new Date().getFullYear()} Website Truyện Tranh. All Rights Reserved.</p>
                    <p className="mt-1">Phát triển bởi Fan Truyện</p>
                </div>
            </div>
        </footer>
    );
};


export default function ChapterPage() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { id } = router.query
  
  const [chapter, setChapter] = useState<Chapter | null>(null)

  const chapterData = useMemo(() => {
    if (!id) return { current: null, prev: null, next: null }

    const chapterId = Number(id)
    const currentIndex = fakeChapters.findIndex(ch => ch.id === chapterId)
    
    if (currentIndex === -1) return { current: null, prev: null, next: null }
    
    const current = fakeChapters[currentIndex]
    const prev = fakeChapters[currentIndex - 1] || null
    const next = fakeChapters[currentIndex + 1] || null

    return { current, prev, next }
  }, [id])

  useEffect(() => {
    setChapter(chapterData.current)
  }, [chapterData])

  const { prev: prevChapter, next: nextChapter } = chapterData

  return (
    // *** SỬA LỖI BỐ CỤC TẠI ĐÂY ***
    // Thêm `flex flex-col` để đảm bảo layout co giãn theo chiều dọc
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col">

      {/* Thêm `flex-grow` để nội dung chính chiếm hết không gian thừa, đẩy footer xuống dưới */}
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 flex-grow">
        {chapter ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8">
            
            <nav className="mb-6 text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
              <Link href="/" className="hover:text-blue-600 flex items-center">
                <FiHome className="mr-1" /> Trang chủ
              </Link>
              <span>/</span>
              <Link href={`/truyen/${chapter.storySlug}`} className="hover:text-blue-600">
                {chapter.storyTitle}
              </Link>
              <span>/</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">{chapter.title}</span>
            </nav>

            <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-white">
              {chapter.title}
            </h1>
            
            <article className="prose prose-lg max-w-none dark:prose-invert text-lg leading-relaxed whitespace-pre-line my-8">
              {chapter.content}
            </article>

            <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center gap-4">
              {prevChapter ? (
                <Link
                  href={`/chuong/${prevChapter.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 hover:text-white rounded-lg transition-colors duration-200"
                >
                  <FiChevronLeft />
                  <span>Chương trước</span>
                </Link>
              ) : <div />}

              {nextChapter ? (
                <Link
                  href={`/chuong/${nextChapter.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 hover:text-white rounded-lg transition-colors duration-200"
                >
                  <span>Chương tiếp</span>
                  <FiChevronRight />
                </Link>
              ) : <div />}
            </div>
          </div>
        ) : (
          <LoadingSpinner />
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
