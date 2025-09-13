import { 
    IsString, 
    IsNotEmpty, 
    IsOptional, 
    IsEnum, 
    IsArray,
    ArrayNotEmpty,
    IsInt
  } from 'class-validator';
  import { StoryStatus } from '@prisma/client';
  
  export class CreateStoryDto {
    @IsString()
    @IsNotEmpty()
    title: string;
  
    @IsString()
    @IsNotEmpty()
    description: string;
  
    @IsOptional()
    @IsString()
    coverImage?: string;
  
    @IsEnum(StoryStatus)
    @IsOptional()
    status?: StoryStatus = StoryStatus.ONGOING;
  
    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    genreIds: number[];
  }
  
  export class UpdateStoryDto {
    @IsString()
    @IsOptional()
    title?: string;
  
    @IsString()
    @IsOptional()
    description?: string;
  
    @IsOptional()
    @IsString()
    coverImage?: string;
  
    @IsEnum(StoryStatus)
    @IsOptional()
    status?: StoryStatus;
  
    @IsArray()
    @IsOptional()
    @IsInt({ each: true })
    genreIds?: number[];
  }

