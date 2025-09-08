import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReadProgressService } from './read-progress.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateReadProgressDto } from './dto';

@Controller('read-progress')
@UseGuards(JwtAuthGuard)
export class ReadProgressController {
  constructor(private readonly readProgressService: ReadProgressService) {}

  @Post()
  async updateReadProgress(@Request() req, @Body() updateProgressDto: UpdateReadProgressDto) {
    const { storyId, chapterId, progress } = updateProgressDto;
    return this.readProgressService.updateReadProgress(
      req.user.id,
      storyId,
      chapterId,
      progress,
    );
  }

  @Get()
  async getUserReadProgress(
    @Request() req,
    @Query('storyId') storyId?: string,
  ) {
    return this.readProgressService.getUserReadProgress(
      req.user.id,
      storyId ? +storyId : undefined,
    );
  }

  @Get('story/:storyId')
  async getStoryReadProgress(@Request() req, @Param('storyId') storyId: string) {
    return this.readProgressService.getStoryReadProgress(req.user.id, +storyId);
  }

  @Get('history')
  async getReadingHistory(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.readProgressService.getReadingHistory(
      req.user.id,
      page ? +page : 1,
      limit ? +limit : 20,
    );
  }

  @Delete('story/:storyId')
  async deleteReadProgress(@Request() req, @Param('storyId') storyId: string) {
    return this.readProgressService.deleteReadProgress(req.user.id, +storyId);
  }

  @Get('chapters-read/:storyId')
  async getChaptersReadCount(@Request() req, @Param('storyId') storyId: string) {
    return this.readProgressService.getChaptersReadCount(req.user.id, +storyId);
  }
}