import { IsNumber, Min, Max, IsNotEmpty } from 'class-validator';

export class UpdateReadProgressDto {
  @IsNumber()
  @IsNotEmpty()
  storyId: number;

  @IsNumber()
  @IsNotEmpty()
  chapterId: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  progress: number;
}
