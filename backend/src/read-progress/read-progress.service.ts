import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReadProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async updateReadProgress(
    userId: number,
    storyId: number,
    chapterId: number,
    progress: number,
  ) {
    // Verify that the chapter belongs to the story
    const chapter = await this.prisma.chapter.findFirst({
      where: {
        id: chapterId,
        storyId: storyId,
      },
    });

    if (!chapter) {
      throw new NotFoundException('Chapter not found in this story');
    }

    // Upsert read progress
    return this.prisma.readProgress.upsert({
      where: {
        userId_storyId: {
          userId,
          storyId,
        },
      },
      update: {
        chapterId,
        progress,
        updatedAt: new Date(),
      },
      create: {
        userId,
        storyId,
        chapterId,
        progress,
      },
      include: {
        story: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true,
          },
        },
        chapter: {
          select: {
            id: true,
            title: true,
            number: true,
          },
        },
      },
    });
  }

  async getUserReadProgress(userId: number, storyId?: number) {
    const where: any = { userId };
    if (storyId) where.storyId = storyId;

    return this.prisma.readProgress.findMany({
      where,
      include: {
        story: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true,
            status: true,
            totalChapters: true,
            author: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
        chapter: {
          select: {
            id: true,
            title: true,
            number: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getStoryReadProgress(userId: number, storyId: number) {
    return this.prisma.readProgress.findUnique({
      where: {
        userId_storyId: {
          userId,
          storyId,
        },
      },
      include: {
        story: {
          select: {
            id: true,
            title: true,
            slug: true,
            totalChapters: true,
          },
        },
        chapter: {
          select: {
            id: true,
            title: true,
            number: true,
          },
        },
      },
    });
  }

  async deleteReadProgress(userId: number, storyId: number) {
    const progress = await this.prisma.readProgress.findUnique({
      where: {
        userId_storyId: {
          userId,
          storyId,
        },
      },
    });

    if (!progress) {
      throw new NotFoundException('Read progress not found');
    }

    return this.prisma.readProgress.delete({
      where: {
        userId_storyId: {
          userId,
          storyId,
        },
      },
    });
  }

  async getReadingHistory(userId: number, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [history, total] = await Promise.all([
      this.prisma.readProgress.findMany({
        where: { userId },
        include: {
          story: {
            select: {
              id: true,
              title: true,
              slug: true,
              coverImage: true,
              status: true,
              totalChapters: true,
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
            },
          },
          chapter: {
            select: {
              id: true,
              title: true,
              number: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.readProgress.count({ where: { userId } }),
    ]);

    return {
      history,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // For triggering popup ads based on chapters read
  async getChaptersReadCount(userId: number, storyId: number) {
    const progress = await this.prisma.readProgress.findUnique({
      where: {
        userId_storyId: {
          userId,
          storyId,
        },
      },
      include: {
        chapter: {
          select: {
            number: true,
          },
        },
      },
    });

    return progress ? progress.chapter.number : 0;
  }
}