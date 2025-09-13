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
    const chapter = await this.prisma.chapter.findFirst({
      where: { id: chapterId, storyId: storyId },
    });

    if (!chapter) {
      throw new NotFoundException('Chapter not found in this story');
    }

    return this.prisma.readProgress.upsert({
      where: { userId_storyId: { userId, storyId } },
      update: { chapterId, progress },
      create: { userId, storyId, chapterId, progress },
    });
  }

  async getReadingHistory(userId: number, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [history, total] = await Promise.all([
      this.prisma.readProgress.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          story: {
            select: {
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
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.readProgress.count({ where: { userId } }),
    ]);

    return {
      data: history,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }
}
