import { Controller, Get, Param } from '@nestjs/common';
import { GenresService } from './genres.service';

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Get()
  findAll() {
    return this.genresService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.genresService.findOneBySlug(slug);
  }
}

