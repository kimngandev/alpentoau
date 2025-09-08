// backend/src/stories/stories.controller.ts
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
  Request
} from '@nestjs/common';
import { StoriesService } from './stories.service';
import { CreateStoryDto, UpdateStoryDto, QueryStoryDto } from './dto/story.dto';

@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  // GET /api/stories - Lấy danh sách truyện với phân trang
  @Get()
  async findAll(@Query() query: QueryStoryDto) {
    const { page, limit, search, genreId } = query;

    // Nếu có search query
    if (search) {
      return this.storiesService.search(search, page, limit);
    }

    // Nếu có genreId
    if (genreId) {
      return this.storiesService.findByGenre(genreId, page, limit);
    }

    // Mặc định lấy tất cả
    return this.storiesService.findAll(page, limit);
  }

  // GET /api/stories/search?q=keyword - Tìm kiếm truyện
  @Get('search')
  async search(
    @Query('q') query: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 20
  ) {
    return this.storiesService.search(query, page, limit);
  }

  // GET /api/stories/:id - Lấy truyện theo ID
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.storiesService.findOne(id);
  }

  // GET /api/stories/slug/:slug - Lấy truyện theo slug
  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.storiesService.findBySlug(slug);
  }

  // POST /api/stories - Tạo truyện mới (cần đăng nhập)
  @Post()
  // @UseGuards(JwtAuthGuard) // TODO: Implement sau khi có auth
  async create(
    @Body() createStoryDto: CreateStoryDto,
    // @Request() req // TODO: Lấy user từ JWT
  ) {
    // TODO: Thay 1 bằng req.user.id khi có auth
    const authorId = 1; // Hardcode tạm thời để test
    return this.storiesService.create(createStoryDto, authorId);
  }

  // PATCH /api/stories/:id - Cập nhật truyện (cần đăng nhập)
  @Patch(':id')
  // @UseGuards(JwtAuthGuard) // TODO: Implement sau khi có auth
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStoryDto: UpdateStoryDto,
    // @Request() req // TODO: Lấy user từ JWT
  ) {
    // TODO: Thay 1 bằng req.user.id khi có auth
    const authorId = 1; // Hardcode tạm thời để test
    return this.storiesService.update(id, updateStoryDto, authorId);
  }

  // DELETE /api/stories/:id - Xóa truyện (cần đăng nhập)
  @Delete(':id')
  // @UseGuards(JwtAuthGuard) // TODO: Implement sau khi có auth
  async remove(
    @Param('id', ParseIntPipe) id: number,
    // @Request() req // TODO: Lấy user từ JWT
  ) {
    // TODO: Thay 1 bằng req.user.id khi có auth
    const authorId = 1; // Hardcode tạm thời để test
    return this.storiesService.remove(id, authorId);
  }
}