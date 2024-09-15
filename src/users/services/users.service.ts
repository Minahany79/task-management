import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
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
  async findOne(id: number) {
    const userInDb = await this.userRepository.findOne({ where: { id } });

    if (!userInDb) {
      throw new NotFoundException(`Cannot find the requested user`);
    }

    return userInDb;
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOne({ where: { email: ILike(email) } });
  }

  async remove(id: number) {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Cannot find the requested user`);
    }

    return result;
  }

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto, userId: number) {
    const userInDb = await this.findOne(userId);

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
    const userInDb = await this.findOne(userId);

    if (!userInDb) {
      throw new NotFoundException(`Cannot find the requested user`);
    }

    const isEmailExist = await this.findOneByEmail(updateUserDto.email);

    if (isEmailExist && isEmailExist.email !== userInDb.email) {
      throw new BadRequestException(`Email already exist`);
    }

    return this.userRepository.update(userId, updateUserDto);
  }
}
