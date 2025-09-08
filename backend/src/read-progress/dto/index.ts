import { IsNumber, Min, Max } from 'class-validator';

export class UpdateReadProgressDto {
  @IsNumber()
  storyId: number;

  @IsNumber()
  chapterId: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  progress: number;
}
