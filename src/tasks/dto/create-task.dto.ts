import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'The title of the task, between 3 and 64 characters long.',
    example: 'Complete project documentation',
  })
  @IsString()
  @Length(3, 64)
  title: string;

  @ApiProperty({
    description:
      'A brief description of the task, between 3 and 255 characters long.',
    example:
      'This task involves completing all project documentation and submitting it.',
  })
  @IsString()
  @Length(3, 255)
  description: string;

  userId: number;
}
