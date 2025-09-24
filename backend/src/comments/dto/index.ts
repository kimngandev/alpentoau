import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateCommentDto {
  @IsOptional()
  @IsNumber()
  storyId?: number;

  @IsOptional()
  @IsNumber()
  chapterId?: number;

  @IsString()
  content: string;

  @IsOptional()
  @IsNumber()
  parentId?: number;
}

export class UpdateCommentDto {
  @IsString()
  content: string;
}
