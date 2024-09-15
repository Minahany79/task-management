import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The name of the user, between 3 and 64 characters long.',
    example: 'John Doe',
  })
  @IsString()
  @Length(3, 64)
  name: string;

  @ApiProperty({
    description: 'The email of the user.',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;
}
