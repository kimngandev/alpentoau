// frontend/pages/tim-kiem.tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { RiSearchLine, RiCompass3Line, RiFireLine, RiArrowRightSLine } from 'react-icons/ri';

import Header from '../components/Header';
import Footer from '../components/Footer';
import FilterBar from '../components/FilterBar';
import TruyenCard from '../components/TruyenCard';
import allStories from '../data/stories.json'; // Giả lập database
import allGenres from '../data/categories.json'; // Giả lập database thể loại

// Lấy kiểu dữ liệu
type Story = typeof allStories[0];

// Dữ liệu giả lập cho các mục gợi ý
const suggestedTags = ["Tiên hiệp", "Xuyên không", "Hệ thống", "Nữ cường", "Đam mỹ"];
const recommendedStories = allStories.slice(0, 5); // Lấy 5 truyện đầu tiên làm đề cử

const SearchDiscoveryPage = () => {
    const router = useRouter();
    const { q } = router.query;

    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<Story[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const query = (q as string || '').toLowerCase();
        setSearchTerm(q as string || '');
        
        if (query) {
            setIsLoading(true);
            // Giả lập tìm kiếm
            setTimeout(() => {
                const filteredStories = allStories.filter(story => 
                    story.title.toLowerCase().includes(query)
                );
                setResults(filteredStories);
                setIsLoading(false);
            }, 500);
        } else {
            setResults([]); // Reset kết quả nếu không có query
        }
    }, [q]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
 
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    {/* <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-2">
                        Khám phá truyện
                    </h1>
                    <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
                        Tìm kiếm câu chuyện tiếp theo của bạn từ hàng ngàn lựa chọn.
                    </p> */}
                    
                    <FilterBar keyword={searchTerm} onChange={setSearchTerm} />

                    <div className="mt-8">
                        {isLoading ? (
                            <div className="text-center text-gray-500">Đang tìm kiếm...</div>
                        ) : results.length > 0 && q ? (
                            <>
                                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                                    Kết quả cho: ‘<span className="text-indigo-500">{searchTerm}</span>’
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
                                    {results.map((story, index) => (
                                        <motion.div 
                                            key={story.id} 
                                            className="flex justify-center"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <TruyenCard {...story} />
                                        </motion.div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="space-y-12">
                                <div>
                                    <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200">
                                        <RiFireLine className="text-red-500"/>
                                        Tìm kiếm phổ biến
                                    </h2>
                                    <div className="flex flex-wrap gap-3">
                                        {suggestedTags.map(tag => (
                                            <Link 
                                                key={tag} 
                                                href={`/tim-kiem?q=${encodeURIComponent(tag)}`}
                                                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-sm font-medium rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
                                            >
                                                {tag}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                                        Có thể bạn sẽ thích
                                    </h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
                                        {recommendedStories.map((story, index) => (
                                             <motion.div 
                                                key={story.id} 
                                                className="flex justify-center"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.08 }}
                                            >
                                                <TruyenCard {...story} />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </main>
          
        </div>
    );
};

export default SearchDiscoveryPage;