// pages/truyen/[slug].tsx

import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { GetStaticPaths, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
// Bổ sung các icon cần thiết từ remixicon
import { RiBookmarkLine, RiMessage3Line, RiSendPlane2Line } from 'react-icons/ri';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TruyenCard from '../../components/TruyenCard';
import stories from '../../data/stories.json';
import chapters from '../../data/chapters.json';

// --- Các type và data giả giữ nguyên như file gốc của bạn ---
type Story = { id: number; title: string; slug: string; description: string; cover: string; views: number; author: string; status: 'Đang ra' | 'Hoàn thành'; genres: string[]; };
type Chapter = { id: number; storyId: number; chapterNumber: number; title: string; slug: string; };
const authors = ['Alpentou', 'Ngã Cật Tây Hồng Thị', 'Thiên Tằm Thổ Đậu', 'Đường Gia Tam Thiếu'];
const storyData: Story[] = stories.map((s, index) => ({ ...s, author: authors[index % authors.length], status: Math.random() > 0.5 ? 'Hoàn thành' : 'Đang ra', genres: ['Hành động', 'Phiêu lưu', 'Fantasy'], }));
type Props = { story: Story; storyChapters: Chapter[]; relatedStories: Story[]; relatedTitle: string; };

// *** BỔ SUNG: Component Khu vực Bình luận ***
// Component này được thiết kế để khớp với UI hiện tại của bạn.
const CommentSection = () => {
  // Dữ liệu bình luận giả
  const comments = [
    { id: 1, author: 'Fan Cứng', avatar: 'https://placehold.co/40x40/c084fc/fff?text=F', content: 'Truyện hay quá, hóng chương mới từng ngày!', time: '2 giờ trước' },
    { id: 2, author: 'Độc Giả Ẩn Danh', avatar: 'https://placehold.co/40x40/7c3aed/fff?text=Đ', content: 'Cốt truyện lôi cuốn, xây dựng nhân vật rất tốt.', time: '1 ngày trước' },
  ];

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
        <RiMessage3Line /> Bình luận
      </h2>
      <div className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-6">
        {/* Form gửi bình luận */}
        <div className="flex items-start gap-4">
          <Image src="https://placehold.co/48x48/94a3b8/fff?text=A" alt="Your Avatar" width={48} height={48} className="rounded-full" />
          <div className="flex-1">
            <textarea
              className="w-full p-3 bg-gray-200 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              rows={3}
              placeholder="Viết bình luận của bạn..."
            ></textarea>
            <button className="mt-3 px-6 py-2 flex items-center gap-2 font-semibold text-white bg-purple-600 rounded-full hover:bg-purple-700 transition-colors">
              <RiSendPlane2Line /> Gửi
            </button>
          </div>
        </div>
        {/* Danh sách bình luận */}
        <div className="mt-8 space-y-6">
          {comments.map(comment => (
            <div key={comment.id} className="flex items-start gap-4">
              <Image src={comment.avatar} alt={comment.author} width={40} height={40} className="rounded-full" />
              <div className="flex-1">
                <div className="bg-gray-200 dark:bg-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-sm text-gray-800 dark:text-white">{comment.author}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{comment.time}</p>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default function StoryDetail({ story, storyChapters, relatedStories, relatedTitle }: Props) {
  const { t } = useTranslation('common');
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0b0418] flex items-center justify-center text-gray-800 dark:text-white">
        {t('loading')}...
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.5); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(168, 85, 247, 0.8); }
      `}</style>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0b0418] text-gray-600 dark:text-gray-300">
        <Header />
        <main>
          <div className="relative pt-24 pb-12 overflow-hidden">
            {/* ... Phần banner giữ nguyên ... */}
            <div className="absolute inset-0">
              <Image src={story.cover} alt={story.title} fill className="object-cover opacity-10 dark:opacity-10 blur-2xl" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent dark:from-[#0b0418] dark:via-[#0b0418]/80 dark:to-[#0b0418]" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative container mx-auto px-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                <div className="flex flex-col items-center">
                  <div className="w-48 md:w-60 flex-shrink-0">
                    <Image src={story.cover} alt={story.title} width={240} height={360} className="w-full h-auto object-cover rounded-lg shadow-lg dark:shadow-2xl dark:shadow-purple-950/50" />
                  </div>
                  {/* *** BỔ SUNG: Nhóm nút hành động *** */}
                  <div className="w-full flex items-center gap-4 mt-8">
                    {storyChapters.length > 0 && (
                      <Link href={`/chuong/${storyChapters[0].id}`} className="flex-1 group relative p-3 text-center font-bold text-white bg-purple-600 rounded-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/40">
                        <span className="relative z-10">{t('readFromStart')}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </Link>
                    )}
                    <button className="p-3 text-xl text-white bg-white/10 border border-white/20 rounded-full hover:bg-pink-500 hover:border-pink-500 transition-colors">
                      <RiBookmarkLine />
                    </button>
                  </div>
                </div>
                {/* ... Phần thông tin truyện giữ nguyên ... */}
                <div className="lg:col-span-2 text-center md:text-left">
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">{story.title}</h1>
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-6 gap-y-2 text-sm mb-6 text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2"><i className="ri-user-star-line text-purple-500 dark:text-purple-400"></i><span>{story.author}</span></div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${story.status === 'Hoàn thành' ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400'}`}><span>{story.status}</span></div>
                    <div className="flex items-center gap-2"><i className="ri-eye-line text-purple-500 dark:text-purple-400"></i><span>{story.views.toLocaleString()} {t('views')}</span></div>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                    {story.genres.map(genre => (
                      <span key={genre} className="px-3 py-1 bg-gray-200 dark:bg-white/5 border border-transparent dark:border-white/10 rounded-full text-xs text-gray-700 dark:text-gray-300">{genre}</span>
                    ))}
                  </div>
                  <p className="mb-8 text-base leading-relaxed">{story.description}</p>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Danh sách chương</h2>
                    <div className="custom-scrollbar bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-2 max-h-60 overflow-y-auto">
                      {storyChapters.length > 0 ? (
                        <ul className="space-y-1">
                          {storyChapters.map(chapter => (
                            <li key={chapter.id}>
                              <Link href={`/chuong/${chapter.id}`} className="block p-3 hover:bg-gray-200 dark:hover:bg-white/10 rounded-md transition-colors text-gray-800 dark:text-gray-300">
                                {`Chương ${chapter.chapterNumber}: ${chapter.title}`}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="p-3 text-center text-gray-500">Chưa có chương nào.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          <div className="container mx-auto px-6 py-12">
            {/* ... Phần truyện liên quan giữ nguyên ... */}
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{relatedTitle}</h2>
            {relatedStories.length > 0 ? (
              <div className="custom-scrollbar -mx-6 flex space-x-6 overflow-x-auto px-6 pb-4">
                {relatedStories.map(relatedStory => (
                  <div key={relatedStory.id} className="flex-shrink-0 w-40 sm:w-44 md:w-48">
                    <TruyenCard {...relatedStory} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">Không có truyện liên quan nào để hiển thị.</div>
            )}
            
            {/* *** BỔ SUNG: Khu vực Bình luận *** */}
            <CommentSection />

            <div className="mt-16">
              <div className="flex justify-center items-center rounded-lg bg-gray-100 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/20 w-full h-24 max-w-4xl mx-auto">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <p className="text-sm">Quảng cáo Banner</p>
                  <p className="text-xs">(728x90)</p>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

// getStaticPaths và getStaticProps giữ nguyên như file gốc của bạn
export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const paths = storyData.flatMap(story => 
    (locales || []).map(locale => ({
      params: { slug: story.slug },
      locale,
    }))
  );
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const slug = params?.slug as string;
  const foundStory = storyData.find((s) => s.slug === slug);

  if (!foundStory) {
    return { notFound: true };
  }

  const chaptersForStory = chapters.filter(c => c.storyId === foundStory.id);
  
  let related = storyData.filter(s => s.author === foundStory.author && s.id !== foundStory.id);
  let relatedTitle = "Truyện cùng tác giả";
  
  if (related.length === 0) {
    relatedTitle = "Có thể bạn cũng thích";
    related = storyData.filter(s => s.id !== foundStory.id);
  }

  return {
    props: {
      story: foundStory,
      storyChapters: chaptersForStory,
      relatedStories: related.slice(0, 5),
      relatedTitle,
      ...(await serverSideTranslations(locale ?? 'vi', ['common', 'story'])),
    },
    revalidate: 60,
  };
};
