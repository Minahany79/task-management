import { IsString, Length } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateTaskDto {
  @IsString()
  @Length(3, 64)
  title: string;

  @IsString()
  @Length(3, 255)
  description: string;
  user: User;
}
