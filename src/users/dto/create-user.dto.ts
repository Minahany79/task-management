import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';
import { Role } from '../../roles/role.entity';

export class CreateUserDto {
  @IsString()
  @Length(3, 64)
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  role: Role;
}
