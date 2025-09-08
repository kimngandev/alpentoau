import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole, StoryStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalStories,
      totalChapters,
      totalComments,
      totalBookmarks,
      recentUsers,
      recentStories,
      topAuthors,
      popularStories,
    ] = await Promise.all([
      // Basic counts
      this.prisma.user.count(),
      this.prisma.story.count(),
      this.prisma.chapter.count(),
      this.prisma.comment.count(),
      this.prisma.bookmark.count(),

      // Recent activity
      this.prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),

      this.prisma.story.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          author: {
            select: {
              username: true,
            },
          },
        },
      }),

      // Top authors by story count
      this.prisma.user.findMany({
        where: { role: UserRole.AUTHOR },
        take: 10,
        select: {
          id: true,
          username: true,
          _count: {
            select: {
              stories: true,
            },
          },
        },
        orderBy: {
          stories: {
            _count: 'desc',
          },
        },
      }),

      // Popular stories by view count
      this.prisma.story.findMany({
        take: 10,
        orderBy: { viewCount: 'desc' },
        select: {
          id: true,
          title: true,
          viewCount: true,
          totalChapters: true,
          author: {
            select: {
              username: true,
            },
          },
          _count: {
            select: {
              bookmarks: true,
              ratings: true,
            },
          },
        },
      }),
    ]);

    return {
      stats: {
        totalUsers,
        totalStories,
        totalChapters,
        totalComments,
        totalBookmarks,
      },
      recentActivity: {
        users: recentUsers,
        stories: recentStories,
      },
      insights: {
        topAuthors,
        popularStories,
      },
    };
  }

  async getUsersStats() {
    const [usersByRole, usersGrowth] = await Promise.all([
      this.prisma.user.groupBy({
        by: ['role'],
        _count: {
          role: true,
        },
      }),

      this.prisma.user.findMany({
        select: {
          createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    // Calculate growth by month
    const monthlyGrowth = usersGrowth.reduce((acc, user) => {
      const month = user.createdAt.toISOString().slice(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      usersByRole,
      monthlyGrowth,
    };
  }

  async getStoriesStats() {
    const [storiesByStatus, storiesGrowth, genreDistribution] = await Promise.all([
      this.prisma.story.groupBy({
        by: ['status'],
        _count: {
          status: true,
        },
      }),

      this.prisma.story.findMany({
        select: {
          createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
      }),

      this.prisma.genre.findMany({
        select: {
          name: true,
          _count: {
            select: {
              storyGenres: true,
            },
          },
        },
        orderBy: {
          storyGenres: {
            _count: 'desc',
          },
        },
        take: 10,
      }),
    ]);

    const monthlyGrowth = storiesGrowth.reduce((acc, story) => {
      const month = story.createdAt.toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      storiesByStatus,
      monthlyGrowth,
      genreDistribution,
    };
  }

  async getAllUsers(page = 1, limit = 20, role?: UserRole, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (role) where.role = role;
    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          isVerified: true,
          createdAt: true,
          _count: {
            select: {
              stories: true,
              comments: true,
              bookmarks: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateUserRole(userId: number, role: UserRole) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isVerified: true,
      },
    });
  }

  async deleteUser(userId: number) {
    // Check if user has stories
    const userWithStories = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            stories: true,
          },
        },
      },
    });

    if (!userWithStories) {
      throw new Error('User not found');
    }

    if (userWithStories._count.stories > 0) {
      throw new Error('Cannot delete user with existing stories');
    }

    return this.prisma.user.delete({
      where: { id: userId },
    });
  }

  async getAllStories(page = 1, limit = 20, status?: StoryStatus, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { username: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [stories, total] = await Promise.all([
      this.prisma.story.findMany({
        where,
        include: {
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
                  name: true,
                },
              },
            },
          },
          _count: {
            select: {
              chapters: true,
              bookmarks: true,
              comments: true,
              ratings: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.story.count({ where }),
    ]);

    return {
      stories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateStoryStatus(storyId: number, status: StoryStatus) {
    return this.prisma.story.update({
      where: { id: storyId },
      data: { status },
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
    });
  }

  async deleteStory(storyId: number) {
    return this.prisma.story.delete({
      where: { id: storyId },
    });
  }

  async getSystemHealth() {
    const [
      dbConnections,
      storageUsage,
      recentErrors,
      performanceMetrics,
    ] = await Promise.all([
      // Database connections (mock data - implement based on your monitoring)
      Promise.resolve({ active: 5, max: 20 }),
      
      // Storage usage (mock data - implement based on your file storage)
      Promise.resolve({ used: '2.5GB', total: '10GB', percentage: 25 }),
      
      // Recent errors (you can implement error logging)
      Promise.resolve([]),
      
      // Performance metrics
      this.getPerformanceMetrics(),
    ]);

    return {
      status: 'healthy',
      database: {
        status: 'connected',
        connections: dbConnections,
      },
      storage: storageUsage,
      errors: recentErrors,
      performance: performanceMetrics,
    };
  }

  private async getPerformanceMetrics() {
    const startTime = Date.now();
    
    // Test database query performance
    await this.prisma.user.findFirst();
    const dbResponseTime = Date.now() - startTime;

    return {
      dbResponseTime,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    };
  }
}