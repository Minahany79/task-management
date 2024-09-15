import { IsString, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'The current password of the user',
    example: 'OldPass123!',
  })
  @IsString()
  oldPassword: string;

  @ApiProperty({
    description: 'The new password that the user wants to set',
    example: 'NewStrongPass456!',
  })
  @IsStrongPassword()
  newPassword: string;
}
