import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  createComment(
    userId: number,
    content: string,
    storyId?: number,
    chapterId?: number,
    parentId?: number,
  ) {
    return this.prisma.comment.create({
      data: {
        content,
        userId,
        storyId,
        chapterId,
        parentId,
      },
      include: { user: { select: { id: true, username: true, avatar: true } } },
    });
  }

  async getCommentsForStory(storyId: number, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: { storyId, parentId: null },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, username: true, avatar: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.comment.count({ where: { storyId, parentId: null } }),
    ]);
    return {
      data: comments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async updateComment(userId: number, commentId: number, content: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (comment?.userId !== userId) {
      throw new ForbiddenException('You can only edit your own comments.');
    }
    return this.prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });
  }

  async deleteComment(userId: number, commentId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (comment?.userId !== userId) {
      throw new ForbiddenException('You can only delete your own comments.');
    }
    return this.prisma.comment.delete({ where: { id: commentId } });
  }
}
