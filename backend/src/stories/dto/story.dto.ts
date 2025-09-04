import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, IsUrl } from 'class-validator';
import { StoryStatus } from '@prisma/client';

export class CreateStoryDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsUrl()
  coverImage?: string;

  @IsNumber()
  @IsNotEmpty()
  genreId: number;

  @IsOptional()
  @IsEnum(StoryStatus)
  status?: StoryStatus;
}

export class UpdateStoryDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  coverImage?: string;

  @IsOptional()
  @IsNumber()
  genreId?: number;

  @IsOptional()
  @IsEnum(StoryStatus)
  status?: StoryStatus;
}

export class StoryQueryDto {
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
