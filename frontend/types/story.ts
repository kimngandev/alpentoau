// frontend/types/story.ts

// Định nghĩa này nên khớp với dữ liệu trả về từ Prisma
export interface Story {
    id: string;
    title: string;
    slug: string;
    description: string;
    coverImage: string;
    status: 'ONGOING' | 'COMPLETED' | 'HIATUS';
    authorId: string;
    createdAt: string;
    updatedAt: string;
    // Các trường có thể có hoặc không
    views?: number;
    rating?: number;
}
