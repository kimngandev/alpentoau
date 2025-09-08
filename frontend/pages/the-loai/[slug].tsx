// frontend/pages/the-loai/[slug].tsx

import { useState, useMemo } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { RiListCheck, RiBook2Line } from 'react-icons/ri';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TruyenCard from '../../components/TruyenCard';
import CategoryFilterBar, { type FilterState } from '../../components/CategoryFilterBar';
import Pagination from '../../components/Pagination';

import { fetchAPI } from '../../lib/api';
import { type Category } from '../../types/category';
// Giả sử bạn có một type Story, nếu chưa có hãy tạo file types/story.ts
import { Story } from '../../types/story'; 

interface GenreDetailPageProps {
  genre: Category;
  stories: Story[];
}

// Số truyện hiển thị trên mỗi trang
const STORIES_PER_PAGE = 12;

export default function GenreDetailPage({ genre, stories: initialStories }: GenreDetailPageProps) {
  const { t } = useTranslation('common');
  
  // --- LOGIC MỚI CHO BỘ LỌC VÀ PHÂN TRANG ---
  const [filters, setFilters] = useState<FilterState>({ status: 'all', sort: 'latest' });
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAndSortedStories = useMemo(() => {
    let filtered = [...initialStories];

    // 1. Lọc theo trạng thái
    if (filters.status !== 'all') {
      filtered = filtered.filter(story => story.status === filters.status);
    }

    // 2. Sắp xếp
    switch (filters.sort) {
      case 'views':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'latest':
      default:
        filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
    }
    return filtered;
  }, [filters, initialStories]);

  // Logic phân trang
  const totalPages = Math.ceil(filteredAndSortedStories.length / STORIES_PER_PAGE);
  const paginatedStories = filteredAndSortedStories.slice(
    (currentPage - 1) * STORIES_PER_PAGE,
    currentPage * STORIES_PER_PAGE
  );

  // Hàm xử lý khi bộ lọc thay đổi
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset về trang 1 mỗi khi lọc
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0418]">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Banner Thể loại */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              {genre.name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {t('genre_description', { count: initialStories.length })}
            </p>
          </div>

          {/* Thanh bộ lọc */}
          <CategoryFilterBar onFilterChange={handleFilterChange} />

          {/* Danh sách truyện */}
          {paginatedStories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 mt-8">
              {paginatedStories.map((story) => (
                <TruyenCard key={story.id} {...story} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
                <RiBook2Line className="mx-auto text-5xl mb-4" />
                <p>{t('no_stories_match_filter')}</p>
            </div>
          )}

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="mt-12">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

// --- CẬP NHẬT API BACKEND ĐỂ LẤY DỮ LIỆU ---

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const genres: Category[] | null = await fetchAPI('/genres');
  const paths = (genres || []).flatMap(genre =>
    (locales || []).map(locale => ({
      params: { slug: genre.slug },
      locale,
    }))
  );
  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const slug = params?.slug as string;
  
  // Gọi API để lấy thông tin thể loại và TẤT CẢ truyện thuộc thể loại đó
  const genre: Category | null = await fetchAPI(`/genres/slug/${slug}`);
  const stories: Story[] | null = genre ? await fetchAPI(`/genres/${genre.id}/stories`) : null;

  if (!genre) {
    return { notFound: true };
  }

  return {
    props: {
      genre,
      stories: stories || [], // Trả về mảng rỗng nếu không có truyện
      ...(await serverSideTranslations(locale ?? 'vi', ['common'])),
    },
    revalidate: 600, // Re-build trang mỗi 10 phút
  };
};
