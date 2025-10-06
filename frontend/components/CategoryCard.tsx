import Link from 'next/link';
import type { Category } from '../types/category';

// Helper to create a URL-friendly slug from a name
const toSlug = (name: string) => {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
};

type Props = {
  category: Category;
  parentName?: string;
};

export default function CategoryCard({ category }: Props) {
  return (
    <Link href={`/the-loai/${toSlug(category.name)}`} legacyBehavior>
      {/* Cải thiện responsive và shadow cho cả 2 theme */}
      <a className="group relative block h-40 sm:h-48 overflow-hidden rounded-lg shadow-md dark:shadow-black/40 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
        
        {/* Background Image Placeholder - giữ nguyên hiệu ứng phóng to khi hover */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
          style={{ backgroundImage: `url(https://source.unsplash.com/random/500x400?fantasy,${category.name})` }}
        ></div>

        {/* Gradient Overlay - Lớp phủ gradient đen đảm bảo text luôn dễ đọc trên mọi ảnh nền, bất kể theme sáng hay tối */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>

        {/* Content - Cải thiện kích thước chữ và thêm hiệu ứng đổ bóng cho text để nổi bật hơn */}
        <div className="relative flex h-full flex-col justify-end p-4 text-white">
          <h3 
            className="text-lg sm:text-xl font-bold tracking-tight transition-colors duration-300 group-hover:text-cyan-300"
            // Thêm text-shadow để chữ dễ đọc hơn trên nền ảnh phức tạp
            style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}
          >
            {category.name}
          </h3>
          <p 
            className="text-sm text-gray-200"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
          >
            {category.itemsCount} truyện
          </p>
        </div>

        {/* Bottom border hover effect - Giữ nguyên hiệu ứng */}
        <div className="absolute bottom-0 left-0 h-1 w-0 bg-cyan-400 transition-all duration-500 group-hover:w-full"></div>
      </a>
    </Link>
  );
}

