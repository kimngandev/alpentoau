import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bookmarks')
@UseGuards(JwtAuthGuard)
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post('story/:storyId')
  async addBookmark(@Request() req, @Param('storyId') storyId: string) {
    return this.bookmarksService.addBookmark(req.user.id, +storyId);
  }

  @Delete('story/:storyId')
  async removeBookmark(@Request() req, @Param('storyId') storyId: string) {
    return this.bookmarksService.removeBookmark(req.user.id, +storyId);
  }

  @Get()
  async getUserBookmarks(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.bookmarksService.getUserBookmarks(
      req.user.id,
      page ? +page : 1,
      limit ? +limit : 20,
    );
  }

  @Get('status/:storyId')
  async checkBookmarkStatus(@Request() req, @Param('storyId') storyId: string) {
    return this.bookmarksService.checkBookmarkStatus(req.user.id, +storyId);
  }

  @Get('stats/:storyId')
  async getBookmarkStats(@Param('storyId') storyId: string) {
    return this.bookmarksService.getBookmarkStats(+storyId);
  }
}