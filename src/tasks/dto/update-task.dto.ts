import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({
    description: 'The title of the task, between 3 and 64 characters long.',
    example: 'Updated complete project documentation',
  })
  @IsString()
  @Length(3, 64)
  title?: string;

  @ApiProperty({
    description:
      'A brief description of the task, between 3 and 255 characters long.',
    example:
      'Updated the task involves completing all project documentation and submitting it.',
  })
  @IsString()
  @Length(3, 255)
  description?: string;
}
