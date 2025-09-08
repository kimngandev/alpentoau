// backend/src/stories/dto/story.dto.ts
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsEnum, 
  IsInt, 
  IsUrl,
  MaxLength,
  MinLength 
} from 'class-validator';
import { Type } from 'class-transformer';
import { StoryStatus } from '@prisma/client';

export class CreateStoryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(2000)
  description: string;

  @IsOptional()
  @IsUrl()
  coverImage?: string;

  @IsEnum(StoryStatus)
  @IsOptional()
  status?: StoryStatus = StoryStatus.ONGOING;

  @IsInt()
  @Type(() => Number)
  genreId: number;
}

export class UpdateStoryDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(200)
  title?: string;

  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsUrl()
  coverImage?: string;

  @IsEnum(StoryStatus)
  @IsOptional()
  status?: StoryStatus;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  genreId?: number;
}

export class QueryStoryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  genreId?: number;
}