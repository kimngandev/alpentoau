import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { StoriesService } from './stories.service';
import { CreateStoryDto, UpdateStoryDto } from './dto/story.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20,
  ) {
    return this.storiesService.findAll(page, limit);
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.storiesService.findBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() createStoryDto: CreateStoryDto) {
    const authorId = req.user.userId;
    return this.storiesService.create(createStoryDto, authorId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() updateStoryDto: UpdateStoryDto,
  ) {
    const authorId = req.user.userId;
    return this.storiesService.update(id, updateStoryDto, authorId);
  }
}
