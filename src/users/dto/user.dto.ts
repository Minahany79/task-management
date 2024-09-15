import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'The unique identifier of the user.',
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'The name of the user.',
    example: 'John Doe',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'The email of the user.',
    example: 'john.doe@example.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'The date the user was created.',
    example: '2023-09-12T15:35:00.000Z',
  })
  @Expose()
  createAt: Date;

  @ApiProperty({
    description: 'The date the user was last updated.',
    example: '2023-09-13T15:35:00.000Z',
  })
  @Expose()
  updateAt: Date;
}
