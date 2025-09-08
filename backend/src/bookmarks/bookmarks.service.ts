import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarksService {
  constructor(private readonly prisma: PrismaService) {}

  async addBookmark(userId: number, storyId: number) {
    // Check if story exists
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    // Check if bookmark already exists
    const existingBookmark = await this.prisma.bookmark.findUnique({
      where: {
        userId_storyId: {
          userId,
          storyId,
        },
      },
    });

    if (existingBookmark) {
      throw new ConflictException('Story already bookmarked');
    }

    return this.prisma.bookmark.create({
      data: {
        userId,
        storyId,
      },
      include: {
        story: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true,
            status: true,
            author: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });
  }

  async removeBookmark(userId: number, storyId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        userId_storyId: {
          userId,
          storyId,
        },
      },
    });

    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }

    return this.prisma.bookmark.delete({
      where: {
        userId_storyId: {
          userId,
          storyId,
        },
      },
    });
  }

  async getUserBookmarks(userId: number, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [bookmarks, total] = await Promise.all([
      this.prisma.bookmark.findMany({
        where: { userId },
        include: {
          story: {
            select: {
              id: true,
              title: true,
              slug: true,
              description: true,
              coverImage: true,
              status: true,
              viewCount: true,
              totalChapters: true,
              createdAt: true,
              updatedAt: true,
              author: {
                select: {
                  id: true,
                  username: true,
                },
              },
              storyGenres: {
                include: {
                  genre: {
                    select: {
                      id: true,
                      name: true,
                      slug: true,
                    },
                  },
                },
              },
              _count: {
                select: {
                  ratings: true,
                  bookmarks: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.bookmark.count({ where: { userId } }),
    ]);

    return {
      bookmarks: bookmarks.map(bookmark => ({
        id: bookmark.id,
        bookmarkedAt: bookmark.createdAt,
        story: bookmark.story,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async checkBookmarkStatus(userId: number, storyId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        userId_storyId: {
          userId,
          storyId,
        },
      },
    });

    return { isBookmarked: !!bookmark };
  }

  async getBookmarkStats(storyId: number) {
    const count = await this.prisma.bookmark.count({
      where: { storyId },
    });

    return { bookmarkCount: count };
  }
}