import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdPosition, AdType } from '@prisma/client';
import { CreateAdDto, UpdateAdDto, AdTriggerContextDto } from './dto';

@Injectable()
export class AdsService {
  constructor(private prisma: PrismaService) {}

  createAd(data: CreateAdDto) {
    return this.prisma.ad.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
    });
  }

  findAll() {
    return this.prisma.ad.findMany();
  }

  findOne(id: number) {
    return this.prisma.ad.findUnique({ where: { id } });
  }

  updateAd(id: number, data: UpdateAdDto) {
    return this.prisma.ad.update({
      where: { id },
      data: {
        ...data,
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate && { endDate: new Date(data.endDate) }),
      },
    });
  }

  deleteAd(id: number) {
    return this.prisma.ad.delete({ where: { id } });
  }

  getActiveAds(type?: AdType, position?: AdPosition) {
    return this.prisma.ad.findMany({
      where: {
        isActive: true,
        type,
        position,
      },
    });
  }

  trackAdImpression(id: number) {
    return this.prisma.ad.update({
      where: { id },
      data: { impressions: { increment: 1 } },
    });
  }

  trackAdClick(id: number) {
    return this.prisma.ad.update({
      where: { id },
      data: { clicks: { increment: 1 } },
    });
  }

  getTriggeredAds(context: AdTriggerContextDto) {
    // Basic implementation, can be expanded with more complex rules
    if (context.position) {
      return this.getActiveAds(undefined, context.position);
    }
    return [];
  }
}
