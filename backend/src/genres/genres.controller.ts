// --- File 1: Cập nhật backend/src/genres/genres.controller.ts ---
import { Controller, Get, Param } from '@nestjs/common';
import { GenresService } from './genres.service';

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Get()
  findAll() {
    return this.genresService.findAll();
  }

  // API MỚI: Lấy thông tin genre bằng slug
  @Get('slug/:slug')
  findOneBySlug(@Param('slug') slug: string) {
    return this.genresService.findOneBySlug(slug);
  }

  // API MỚI: Lấy tất cả truyện thuộc một genre
  @Get(':id/stories')
  findStoriesByGenre(@Param('id') id: string) {
    return this.genresService.findStoriesByGenre(id);
  }
}

// --- File 2: Cập nhật backend/src/genres/genres.service.ts ---
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GenresService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.genre.findMany({
      orderBy: { name: 'asc' },
    });
  }
  
  async findOneBySlug(slug: string) {
    const genre = await this.prisma.genre.findUnique({ where: { slug } });
    if (!genre) {
      throw new NotFoundException(`Genre with slug "${slug}" not found`);
    }
    return genre;
  }

  async findStoriesByGenre(id: string) {
    // Tìm các truyện có chứa genreId này trong bảng quan hệ nhiều-nhiều
    return this.prisma.story.findMany({
        where: {
            genres: {
                some: {
                    id: id
                }
            }
        },
        orderBy: {
            updatedAt: 'desc'
        }
    });
  }
}
