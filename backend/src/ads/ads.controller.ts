import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdsService } from './ads.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { CreateAdDto, UpdateAdDto, AdTriggerContextDto } from './dto';

@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  // Public routes for displaying ads
  @Get('active')
  async getActiveAds(
    @Query('type') type?: string,
    @Query('position') position?: string,
  ) {
    return this.adsService.getActiveAds(type as any, position as any);
  }

  @Post('triggered')
  async getTriggeredAds(@Body() context: AdTriggerContextDto) {
    return this.adsService.getTriggeredAds(context);
  }

  @Post(':id/impression')
  async trackImpression(@Param('id') id: string) {
    return this.adsService.trackAdImpression(+id);
  }

  @Post(':id/click')
  async trackClick(@Param('id') id: string) {
    return this.adsService.trackAdClick(+id);
  }

  // Admin routes
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  async createAd(@Body() createAdDto: CreateAdDto) {
    return this.adsService.createAd(createAdDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  async getAllAds(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adsService.getAllAds(
      page ? +page : 1,
      limit ? +limit : 20,
    );
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get(':id')
  async getAdById(@Param('id') id: string) {
    return this.adsService.getAdById(+id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id')
  async updateAd(@Param('id') id: string, @Body() updateAdDto: UpdateAdDto) {
    return this.adsService.updateAd(+id, updateAdDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  async deleteAd(@Param('id') id: string) {
    return this.adsService.deleteAd(+id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get(':id/stats')
  async getAdStatistics(@Param('id') id: string) {
    return this.adsService.getAdStatistics(+id);
  }
}

// backend/src/ads/dto/index.ts
import { IsString, IsOptional, IsEnum, IsBoolean, IsNumber } from 'class-validator';
import { AdType, AdPosition } from '@prisma/client';

export class CreateAdDto {
  @IsString()
  title: string;

  @IsEnum(AdType)
  type: AdType;

  @IsEnum(AdPosition)
  position: AdPosition;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  linkUrl?: string;

  @IsOptional()
  @IsString()
  triggerRule?: string;
}

export class UpdateAdDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(AdType)
  type?: AdType;

  @IsOptional()
  @IsEnum(AdPosition)
  position?: AdPosition;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  linkUrl?: string;

  @IsOptional()
  @IsString()
  triggerRule?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class AdTriggerContextDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsNumber()
  chaptersRead?: number;

  @IsOptional()
  @IsNumber()
  currentStoryId?: number;
}