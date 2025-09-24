import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { AdType, AdPosition } from '@prisma/client';

export class CreateAdDto {
  @IsString()
  title: string;

  @IsEnum(AdType)
  type: AdType;

  @IsEnum(AdPosition)
  position: AdPosition;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsString()
  linkUrl: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  startDate: string; // Using string to accept ISO date format from client

  @IsString()
  endDate: string; // Using string to accept ISO date format from client
}

export class UpdateAdDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(AdType)
  type?: AdType;

  @IsOptional()
  @IsEnum(AdPosition)
  position?: AdPosition;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  linkUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}

export class AdTriggerContextDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsNumber()
  chaptersRead?: number;

  @IsOptional()
  @IsNumber()
  currentStoryId?: number;

  @IsOptional()
  @IsEnum(AdPosition)
  position?: AdPosition;
}
