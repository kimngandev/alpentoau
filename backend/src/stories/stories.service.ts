// backend/src/stories/stories.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoryDto, UpdateStoryDto } from './dto/story.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class StoriesService {
  constructor(private prisma: PrismaService) {}

  // Lấy tất cả truyện với phân trang
  async findAll(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    
    const [stories, total] = await Promise.all([
      this.prisma.story.findMany({
        skip,
        take: limit,
        include: {
          author: {
            select: { id: true, username: true }
          },
          genre: true,
          chapters: {
            select: { id: true },
            orderBy: { number: 'desc' }
          },
          _count: {
            select: { 
              chapters: true,
              ratings: true,
              follows: true 
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      }),
      this.prisma.story.count()
    ]);

    return {
      data: stories,
      meta: {
        current_page: page,
        per_page: limit,
        total,
        total_pages: Math.ceil(total / limit)
      }
    };
  }

  // Lấy truyện theo ID
  async findOne(id: number) {
    const story = await this.prisma.story.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, username: true }
        },
        genre: true,
        chapters: {
          select: { 
            id: true, 
            title: true, 
            number: true, 
            createdAt: true 
          },
          orderBy: { number: 'asc' }
        },
        ratings: {
          select: { rating: true }
        },
        _count: {
          select: { 
            chapters: true,
            ratings: true,
            follows: true 
          }
        }
      }
    });

    if (!story) {
      throw new NotFoundException(`Không tìm thấy truyện với ID ${id}`);
    }

    // Tính điểm rating trung bình
    const avgRating = story.ratings.length > 0 
      ? story.ratings.reduce((sum, r) => sum + r.rating, 0) / story.ratings.length
      : 0;

    return {
      ...story,
      averageRating: Number(avgRating.toFixed(1))
    };
  }

  // Lấy truyện theo slug (title converted to slug)
  async findBySlug(slug: string) {
    // Convert slug back to title để tìm kiếm
    const title = slug.replace(/-/g, ' ');
    
    const story = await this.prisma.story.findFirst({
      where: { 
        title: {
          contains: title,
          mode: 'insensitive'
        }
      },
      include: {
        author: {
          select: { id: true, username: true }
        },
        genre: true,
        chapters: {
          select: { 
            id: true, 
            title: true, 
            number: true, 
            createdAt: true 
          },
          orderBy: { number: 'asc' }
        },
        ratings: {
          select: { rating: true }
        },
        _count: {
          select: { 
            chapters: true,
            ratings: true,
            follows: true 
          }
        }
      }
    });

    if (!story) {
      throw new NotFoundException(`Không tìm thấy truyện với slug: ${slug}`);
    }

    // Tính điểm rating trung bình
    const avgRating = story.ratings.length > 0 
      ? story.ratings.reduce((sum, r) => sum + r.rating, 0) / story.ratings.length
      : 0;

    return {
      ...story,
      averageRating: Number(avgRating.toFixed(1))
    };
  }

  // Tạo truyện mới
  async create(createStoryDto: CreateStoryDto, authorId: number) {
    return this.prisma.story.create({
      data: {
        ...createStoryDto,
        authorId
      },
      include: {
        author: {
          select: { id: true, username: true }
        },
        genre: true
      }
    });
  }

  // Cập nhật truyện
  async update(id: number, updateStoryDto: UpdateStoryDto, authorId: number) {
    // Kiểm tra truyện có tồn tại và người dùng có quyền sửa không
    const story = await this.prisma.story.findUnique({
      where: { id }
    });

    if (!story) {
      throw new NotFoundException(`Không tìm thấy truyện với ID ${id}`);
    }

    if (story.authorId !== authorId) {
      throw new NotFoundException('Bạn không có quyền sửa truyện này');
    }

    return this.prisma.story.update({
      where: { id },
      data: updateStoryDto,
      include: {
        author: {
          select: { id: true, username: true }
        },
        genre: true
      }
    });
  }

  // Xóa truyện
  async remove(id: number, authorId: number) {
    const story = await this.prisma.story.findUnique({
      where: { id }
    });

    if (!story) {
      throw new NotFoundException(`Không tìm thấy truyện với ID ${id}`);
    }

    if (story.authorId !== authorId) {
      throw new NotFoundException('Bạn không có quyền xóa truyện này');
    }

    return this.prisma.story.delete({
      where: { id }
    });
  }

  // Tìm kiếm truyện
  async search(query: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    
    const [stories, total] = await Promise.all([
      this.prisma.story.findMany({
        where: {
          OR: [
            {
              title: {
                contains: query,
                mode: 'insensitive'
              }
            },
            {
              description: {
                contains: query,
                mode: 'insensitive'
              }
            },
            {
              author: {
                username: {
                  contains: query,
                  mode: 'insensitive'
                }
              }
            }
          ]
        },
        skip,
        take: limit,
        include: {
          author: {
            select: { id: true, username: true }
          },
          genre: true,
          _count: {
            select: { 
              chapters: true,
              ratings: true,
              follows: true 
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      }),
      this.prisma.story.count({
        where: {
          OR: [
            {
              title: {
                contains: query,
                mode: 'insensitive'
              }
            },
            {
              description: {
                contains: query,
                mode: 'insensitive'
              }
            }
          ]
        }
      })
    ]);

    return {
      data: stories,
      meta: {
        current_page: page,
        per_page: limit,
        total,
        total_pages: Math.ceil(total / limit),
        query
      }
    };
  }

  // Lấy truyện theo thể loại
  async findByGenre(genreId: number, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    
    const [stories, total] = await Promise.all([
      this.prisma.story.findMany({
        where: { genreId },
        skip,
        take: limit,
        include: {
          author: {
            select: { id: true, username: true }
          },
          genre: true,
          _count: {
            select: { 
              chapters: true,
              ratings: true,
              follows: true 
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      }),
      this.prisma.story.count({
        where: { genreId }
      })
    ]);

    return {
      data: stories,
      meta: {
        current_page: page,
        per_page: limit,
        total,
        total_pages: Math.ceil(total / limit)
      }
    };
  }
}