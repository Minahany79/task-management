import { IsEmail, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Length(3, 64)
  name: string;

  @IsEmail()
  email: string;
}
