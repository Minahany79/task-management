import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}
  getUserById(id: number, relations?: string[]) {
    return this.userRepository.findOne({ where: { id }, relations });
  }

  getUserByEmail(email: string, relations?: string[]) {
    return this.userRepository.findOne({ where: { email }, relations });
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

  async create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto, userId: number) {
    const userInDb = await this.getUserById(userId);

    if (!userInDb) {
      throw new NotFoundException(`Cannot find the requested user`);
    }

    if (
      !(await bcrypt.compare(updatePasswordDto.oldPassword, userInDb.password))
    ) {
      throw new BadRequestException(`Invalid password`);
    }

    const newPassword = bcrypt.hashSync(
      updatePasswordDto.newPassword,
      this.configService.get('SALT_ROUNDS'),
    );
    return this.userRepository.update(userId, { password: newPassword });
  }

  async update(updateUserDto: UpdateUserDto, userId: number) {
    const userInDb = await this.getUserById(userId);

    if (!userInDb) {
      throw new NotFoundException(`Cannot find the requested user`);
    }

    const isEmailExist = await this.getUserByEmail(
      updateUserDto.email.toLowerCase(),
    );

    if (isEmailExist && isEmailExist.email !== userInDb.email) {
      throw new BadRequestException(`Email already exist`);
    }

    return this.userRepository.update(userId, updateUserDto);
  }
}
