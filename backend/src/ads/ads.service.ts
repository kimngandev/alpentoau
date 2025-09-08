import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdType, AdPosition } from '@prisma/client';

@Injectable()
export class AdsService {
  constructor(private readonly prisma: PrismaService) {}

  async createAd(data: {
    title: string;
    type: AdType;
    position: AdPosition;
    content: string;
    imageUrl?: string;
    linkUrl?: string;
    triggerRule?: string;
  }) {
    return this.prisma.ad.create({
      data,
    });
  }

  async getAllAds(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [ads, total] = await Promise.all([
      this.prisma.ad.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.ad.count(),
    ]);

    return {
      ads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getActiveAds(type?: AdType, position?: AdPosition) {
    const where: any = { isActive: true };
    
    if (type) where.type = type;
    if (position) where.position = position;

    return this.prisma.ad.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAdById(id: number) {
    const ad = await this.prisma.ad.findUnique({
      where: { id },
    });

    if (!ad) {
      throw new NotFoundException('Ad not found');
    }

    return ad;
  }

  async updateAd(id: number, data: {
    title?: string;
    type?: AdType;
    position?: AdPosition;
    content?: string;
    imageUrl?: string;
    linkUrl?: string;
    triggerRule?: string;
    isActive?: boolean;
  }) {
    const ad = await this.prisma.ad.findUnique({
      where: { id },
    });

    if (!ad) {
      throw new NotFoundException('Ad not found');
    }

    return this.prisma.ad.update({
      where: { id },
      data,
    });
  }

  async deleteAd(id: number) {
    const ad = await this.prisma.ad.findUnique({
      where: { id },
    });

    if (!ad) {
      throw new NotFoundException('Ad not found');
    }

    return this.prisma.ad.delete({
      where: { id },
    });
  }

  async trackAdImpression(id: number) {
    return this.prisma.ad.update({
      where: { id },
      data: {
        impressionCount: {
          increment: 1,
        },
      },
    });
  }

  async trackAdClick(id: number) {
    return this.prisma.ad.update({
      where: { id },
      data: {
        clickCount: {
          increment: 1,
        },
      },
    });
  }

  async getAdStatistics(id: number) {
    const ad = await this.prisma.ad.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        type: true,
        position: true,
        clickCount: true,
        impressionCount: true,
        createdAt: true,
      },
    });

    if (!ad) {
      throw new NotFoundException('Ad not found');
    }

    const ctr = ad.impressionCount > 0 ? (ad.clickCount / ad.impressionCount) * 100 : 0;

    return {
      ...ad,
      clickThroughRate: parseFloat(ctr.toFixed(2)),
    };
  }

  // Get ads based on trigger rules (for popup ads after X chapters)
  async getTriggeredAds(context: {
    userId?: number;
    chaptersRead?: number;
    currentStoryId?: number;
  }) {
    const activeAds = await this.prisma.ad.findMany({
      where: { 
        isActive: true,
        type: 'POPUP'
      },
    });

    // Filter ads based on trigger rules
    const triggeredAds = activeAds.filter(ad => {
      if (!ad.triggerRule) return true;

      try {
        const rule = JSON.parse(ad.triggerRule);
        
        // Example rule: { "chaptersRead": 2, "frequency": "every" }
        if (rule.chaptersRead && context.chaptersRead) {
          if (rule.frequency === 'every') {
            return context.chaptersRead % rule.chaptersRead === 0;
          } else if (rule.frequency === 'after') {
            return context.chaptersRead >= rule.chaptersRead;
          }
        }

        return true;
      } catch {
        return true; // If rule parsing fails, show the ad
      }
    });

    return triggeredAds;
  }
}