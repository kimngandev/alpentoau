import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { CreateStoryDto, UpdateStoryDto } from './dto/story.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Get()
  async getAllStories(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('genre') genre?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.storiesService.getAllStories({ page, limit, genre, search, status });
  }

  @Get('featured')
  async getFeaturedStories() {
    return this.storiesService.getFeaturedStories();
  }

  @Get('trending')
  async getTrendingStories() {
    return this.storiesService.getTrendingStories();
  }

  @Get(':id')
  async getStoryById(@Param('id') id: string) {
    return this.storiesService.getStoryById(parseInt(id));
  }

  @Get(':id/chapters')
  async getStoryChapters(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.storiesService.getStoryChapters(parseInt(id), { page, limit });
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AUTHOR, UserRole.ADMIN)
  async createStory(@Body() createStoryDto: CreateStoryDto) {
    return this.storiesService.createStory(createStoryDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AUTHOR, UserRole.ADMIN)
  async updateStory(
    @Param('id') id: string,
    @Body() updateStoryDto: UpdateStoryDto,
  ) {
    return this.storiesService.updateStory(parseInt(id), updateStoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AUTHOR, UserRole.ADMIN)
  async deleteStory(@Param('id') id: string) {
    return this.storiesService.deleteStory(parseInt(id));
  }

  @Post(':id/follow')
  @UseGuards(JwtAuthGuard)
  async followStory(@Param('id') id: string) {
    return this.storiesService.followStory(parseInt(id));
  }

  @Delete(':id/follow')
  @UseGuards(JwtAuthGuard)
  async unfollowStory(@Param('id') id: string) {
    return this.storiesService.unfollowStory(parseInt(id));
  }

  @Post(':id/rate')
  @UseGuards(JwtAuthGuard)
  async rateStory(
    @Param('id') id: string,
    @Body() ratingData: { rating: number; comment?: string },
  ) {
    return this.storiesService.rateStory(parseInt(id), ratingData);
  }
}
