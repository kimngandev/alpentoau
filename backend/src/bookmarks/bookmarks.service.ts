import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarksService {
  constructor(private prisma: PrismaService) {}

  async addBookmark(userId: number, storyId: number) {
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
    });
    if (!story) {
      throw new NotFoundException('Story not found');
    }

    return this.prisma.bookmark.upsert({
      where: { userId_storyId: { userId, storyId } },
      update: {},
      create: { userId, storyId },
    });
  }

  async removeBookmark(userId: number, storyId: number) {
    return this.prisma.bookmark.delete({
      where: { userId_storyId: { userId, storyId } },
    });
  }

  async getBookmarks(userId: number, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [bookmarks, total] = await Promise.all([
      this.prisma.bookmark.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          story: {
            include: {
              author: true,
              _count: {
                select: { chapters: true },
              },
            },
          },
        },
      }),
      this.prisma.bookmark.count({ where: { userId } }),
    ]);

    return {
      data: bookmarks,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }
}
