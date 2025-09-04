import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoryDto, UpdateStoryDto, StoryQueryDto } from './dto/story.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class StoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllStories(query: StoryQueryDto) {
    const { page = 1, limit = 10, genre, search, status } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.StoryWhereInput = {};
    
    if (genre) {
      where.genre = { name: genre };
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (status) {
      where.status = status as any;
    }

    const [stories, total] = await Promise.all([
      this.prisma.story.findMany({
        where,
        include: {
          author: { select: { id: true, username: true } },
          genre: { select: { id: true, name: true } },
          _count: { select: { chapters: true, follows: true, ratings: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.story.count({ where }),
    ]);

    return {
      stories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getFeaturedStories() {
    return this.prisma.story.findMany({
      where: { status: 'ONGOING' },
      include: {
        author: { select: { username: true } },
        genre: { select: { name: true } },
        _count: { select: { chapters: true, follows: true, ratings: true } },
      },
      take: 10,
      orderBy: { follows: { _count: 'desc' } },
    });
  }

  async getTrendingStories() {
    return this.prisma.story.findMany({
      include: {
        author: { select: { username: true } },
        genre: { select: { name: true } },
        _count: { select: { chapters: true, follows: true, ratings: true } },
      },
      take: 10,
      orderBy: { ratings: { _count: 'desc' } },
    });
  }

  async getStoryById(id: number) {
    const story = await this.prisma.story.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, username: true } },
        genre: { select: { id: true, name: true } },
        _count: { select: { chapters: true, follows: true, ratings: true } },
      },
    });

    if (!story) {
      throw new NotFoundException('Không tìm thấy truyện');
    }

    return story;
  }

  async getStoryChapters(id: number, query: { page: number; limit: number }) {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const [chapters, total] = await Promise.all([
      this.prisma.chapter.findMany({
        where: { storyId: id },
        select: {
          id: true,
          title: true,
          number: true,
          createdAt: true,
          _count: { select: { comments: true } },
        },
        skip,
        take: limit,
        orderBy: { number: 'asc' },
      }),
      this.prisma.chapter.count({ where: { storyId: id } }),
    ]);

    return {
      chapters,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async createStory(createStoryDto: CreateStoryDto, authorId: number) {
    return this.prisma.story.create({
      data: {
        ...createStoryDto,
        authorId,
      },
      include: {
        author: { select: { username: true } },
        genre: { select: { name: true } },
      },
    });
  }

  async updateStory(id: number, updateStoryDto: UpdateStoryDto, userId: number) {
    const story = await this.prisma.story.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!story) {
      throw new NotFoundException('Không tìm thấy truyện');
    }

    if (story.authorId !== userId) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa truyện này');
    }

    return this.prisma.story.update({
      where: { id },
      data: updateStoryDto,
      include: {
        author: { select: { username: true } },
        genre: { select: { name: true } },
      },
    });
  }

  async deleteStory(id: number, userId: number) {
    const story = await this.prisma.story.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!story) {
      throw new NotFoundException('Không tìm thấy truyện');
    }

    if (story.authorId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa truyện này');
    }

    await this.prisma.story.delete({ where: { id } });
    return { message: 'Đã xóa truyện thành công' };
  }

  async followStory(id: number, userId: number) {
    await this.prisma.follow.upsert({
      where: { userId_storyId: { userId, storyId: id } },
      update: {},
      create: { userId, storyId: id },
    });

    return { message: 'Đã theo dõi truyện thành công' };
  }

  async unfollowStory(id: number, userId: number) {
    await this.prisma.follow.delete({
      where: { userId_storyId: { userId, storyId: id } },
    });

    return { message: 'Đã bỏ theo dõi truyện thành công' };
  }

  async rateStory(id: number, ratingData: { rating: number; comment?: string }, userId: number) {
    const { rating, comment } = ratingData;

    if (rating < 1 || rating > 5) {
      throw new Error('Điểm đánh giá phải từ 1-5');
    }

    await this.prisma.rating.upsert({
      where: { storyId_userId: { storyId: id, userId } },
      update: { rating, comment },
      create: { storyId: id, userId, rating, comment },
    });

    return { message: 'Đã đánh giá truyện thành công' };
  }
}
