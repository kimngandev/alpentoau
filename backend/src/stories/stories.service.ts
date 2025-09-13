import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoryDto, UpdateStoryDto } from './dto/story.dto';
import { Prisma } from '@prisma/client';

function slugify(text: string) {
    return text
      .toString()
      .toLowerCase()
      .normalize('NFD') // Normalize Unicode characters
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
  }

@Injectable()
export class StoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [stories, total] = await Promise.all([
        this.prisma.story.findMany({
            skip,
            take: limit,
            orderBy: { updatedAt: 'desc' },
        }),
        this.prisma.story.count(),
    ]);
    return { data: stories, totalPages: Math.ceil(total/limit), currentPage: page };
  }
  
  async findBySlug(slug: string) {
    const story = await this.prisma.story.findUnique({
        where: { slug },
        include: {
            author: true,
            genres: { include: { genre: true } },
            chapters: { orderBy: { number: 'asc' } },
            _count: {
                select: { bookmarks: true, ratings: true, views: true }
            }
        }
    });
    if (!story) {
        throw new NotFoundException(`Story with slug "${slug}" not found`);
    }
    return story;
  }

  async create(createStoryDto: CreateStoryDto, authorId: number) {
    const { title, description, coverImage, status, genreIds } = createStoryDto;
    const slug = slugify(title);

    return this.prisma.story.create({
      data: {
        title,
        slug,
        description,
        coverImage,
        status,
        authorId,
        genres: {
          create: genreIds.map((genreId) => ({
            genre: {
              connect: { id: genreId },
            },
          })),
        },
      },
    });
  }

  async update(id: number, updateStoryDto: UpdateStoryDto, authorId: number) {
    const { title, genreIds, ...rest } = updateStoryDto;
    
    const dataToUpdate: any = { ...rest };

    if (title) {
        dataToUpdate.slug = slugify(title);
        dataToUpdate.title = title;
    }

    if (genreIds) {
        dataToUpdate.genres = {
            deleteMany: {},
            create: genreIds.map((genreId) => ({
                genre: {
                    connect: { id: genreId },
                },
            })),
        };
    }

    return this.prisma.story.update({
      where: { id },
      data: dataToUpdate
    });
  }
}

