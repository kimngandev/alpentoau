import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GenresService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.genre.findMany({
        orderBy: { name: 'asc' }
    });
  }

  async findOneBySlug(slug: string) {
    const genre = await this.prisma.genre.findUnique({
      where: { slug },
    });

    if (!genre) {
      throw new NotFoundException(`Genre with slug "${slug}" not found`);
    }

    const stories = await this.prisma.story.findMany({
        where: {
            genres: {
                some: {
                    genre: {
                        slug: slug
                    }
                }
            }
        },
        include: {
            author: { select: { id: true, username: true }},
            _count: {
                select: { chapters: true, views: true }
            }
        }
    });

    return { ...genre, stories };
  }
}

