import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from '../dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const userInDb = await this.usersService.getUserByEmail(
      createUserDto.email,
    );
    if (userInDb) {
      throw new BadRequestException('User already exists');
    }

    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      parseInt(this.configService.get('SALT_ROUNDS')),
    );

    const newUser = await this.usersService.create(createUserDto);
    return {
      token: this.generateToken(newUser),
    };
  }

  async login(loginDto: LoginDto) {
    const userInDb = await this.usersService.getUserByEmail(loginDto.email);
    if (!userInDb) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      userInDb.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Password is not valid');
    }
    return {
      token: this.generateToken(userInDb),
    };
  }

  private generateToken(userInDb: User) {
    return this.provideToken(this.getUserClaims(userInDb));
  }

  private provideToken(tokenClaims: Record<string, any>): string {
    return this.jwtService.sign(tokenClaims);
  }

  private getUserClaims(user: User): Record<string, any> {
    return {
      userId: user.id,
      userEmail: user.email,
    };
  }
}
