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
  ParseIntPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateCommentDto, UpdateCommentDto } from './dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createComment(@Request() req, @Body() createCommentDto: CreateCommentDto) {
    const { storyId, chapterId, content, parentId } = createCommentDto;
    return this.commentsService.createComment(
      req.user.userId,
      content,
      storyId,
      chapterId,
      parentId,
    );
  }

  @Get('story/:storyId')
  getStoryComments(
    @Param('storyId', ParseIntPipe) storyId: number,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20,
  ) {
    return this.commentsService.getCommentsForStory(storyId, page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateComment(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.updateComment(
      req.user.userId,
      id,
      updateCommentDto.content,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteComment(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.commentsService.deleteComment(req.user.userId, id);
  }
}
