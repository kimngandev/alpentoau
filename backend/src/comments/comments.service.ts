import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(userId: number, storyId?: number, chapterId?: number, content: string, parentId?: number) {
    if (!storyId && !chapterId) {
      throw new ForbiddenException('Must provide either storyId or chapterId');
    }

    return this.prisma.comment.create({
      data: {
        userId,
        storyId,
        chapterId,
        content,
        parentId,
      },
      include: {
        user: {
          select: { id: true, username: true, avatar: true },
        },
        replies: {
          include: {
            user: {
              select: { id: true, username: true, avatar: true },
            },
          },
        },
      },
    });
  }

  async getCommentsByStory(storyId: number, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: { storyId, parentId: null },
        include: {
          user: {
            select: { id: true, username: true, avatar: true },
          },
          replies: {
            include: {
              user: {
                select: { id: true, username: true, avatar: true },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.comment.count({ where: { storyId, parentId: null } }),
    ]);

    return {
      comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCommentsByChapter(chapterId: number, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: { chapterId, parentId: null },
        include: {
          user: {
            select: { id: true, username: true, avatar: true },
          },
          replies: {
            include: {
              user: {
                select: { id: true, username: true, avatar: true },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.comment.count({ where: { chapterId, parentId: null } }),
    ]);

    return {
      comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateComment(commentId: number, userId: number, content: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    return this.prisma.comment.update({
      where: { id: commentId },
      data: { content },
      include: {
        user: {
          select: { id: true, username: true, avatar: true },
        },
      },
    });
  }

  async deleteComment(commentId: number, userId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    return this.prisma.comment.delete({
      where: { id: commentId },
    });
  }
}