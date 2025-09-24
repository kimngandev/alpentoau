import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [userCount, storyCount, chapterCount, commentCount, bookmarkCount] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.story.count(),
        this.prisma.chapter.count(),
        this.prisma.comment.count(),
        this.prisma.bookmark.count(),
      ]);

    return {
      users: userCount,
      stories: storyCount,
      chapters: chapterCount,
      comments: commentCount,
      bookmarks: bookmarkCount,
    };
  }

  async getTopStories() {
    const stories = await this.prisma.story.findMany({
      take: 5,
      orderBy: {
        views: {
          _count: 'desc',
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        _count: {
          select: {
            views: true,
            bookmarks: true,
            comments: true,
          },
        },
      },
    });

    return stories.map((story) => ({
      id: story.id,
      title: story.title,
      slug: story.slug,
      viewCount: story._count.views,
      bookmarkCount: story._count.bookmarks,
      commentCount: story._count.comments,
    }));
  }
}
