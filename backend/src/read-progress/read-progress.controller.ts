import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ReadProgressService } from './read-progress.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateReadProgressDto } from './dto';

@Controller('read-progress')
@UseGuards(JwtAuthGuard)
export class ReadProgressController {
  constructor(private readonly readProgressService: ReadProgressService) {}

  @Post()
  updateReadProgress(@Request() req, @Body() updateProgressDto: UpdateReadProgressDto) {
    const { storyId, chapterId, progress } = updateProgressDto;
    return this.readProgressService.updateReadProgress(
      req.user.userId,
      storyId,
      chapterId,
      progress,
    );
  }

  @Get('history')
  getReadingHistory(
    @Request() req,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    return this.readProgressService.getReadingHistory(
      req.user.userId,
      page,
      limit,
    );
  }
}
