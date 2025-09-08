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
  Request,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateCommentDto, UpdateCommentDto } from './dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(@Request() req, @Body() createCommentDto: CreateCommentDto) {
    const { storyId, chapterId, content, parentId } = createCommentDto;
    return this.commentsService.createComment(
      req.user.id,
      storyId,
      chapterId,
      content,
      parentId,
    );
  }

  @Get('story/:storyId')
  async getStoryComments(
    @Param('storyId') storyId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.commentsService.getCommentsByStory(
      +storyId,
      page ? +page : 1,
      limit ? +limit : 20,
    );
  }

  @Get('chapter/:chapterId')
  async getChapterComments(
    @Param('chapterId') chapterId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.commentsService.getCommentsByChapter(
      +chapterId,
      page ? +page : 1,
      limit ? +limit : 20,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateComment(
    @Param('id') id: string,
    @Request() req,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.updateComment(+id, req.user.id, updateCommentDto.content);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteComment(@Param('id') id: string, @Request() req) {
    return this.commentsService.deleteComment(+id, req.user.id);
  }
}