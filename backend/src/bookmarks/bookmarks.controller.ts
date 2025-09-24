import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bookmarks')
@UseGuards(JwtAuthGuard)
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post('story/:storyId')
  async addBookmark(
    @Request() req,
    @Param('storyId', ParseIntPipe) storyId: number,
  ) {
    return this.bookmarksService.addBookmark(req.user.userId, storyId);
  }

  @Delete('story/:storyId')
  async removeBookmark(
    @Request() req,
    @Param('storyId', ParseIntPipe) storyId: number,
  ) {
    return this.bookmarksService.removeBookmark(req.user.userId, storyId);
  }

  @Get()
  async getUserBookmarks(
    @Request() req,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20,
  ) {
    return this.bookmarksService.getBookmarks(req.user.userId, page, limit);
  }
}
