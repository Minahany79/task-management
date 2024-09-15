import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { LoginDto } from '../dto/login.dto';
import { CreateUserDto } from '../dto/create-user.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  const mockUsersService = {
    findOneByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signUp', () => {
    it('should throw BadRequestException if user already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      };

      mockUsersService.findOneByEmail.mockResolvedValue({} as User);

      await expect(authService.signUp(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create a new user and return a token', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      };

      const newUser: User = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed_password',
        name: 'Test User',
      } as User;

      mockUsersService.findOneByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(newUser);
      mockConfigService.get.mockReturnValue('10');
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation((password: string) => Promise.resolve(password));
      jest.spyOn(jwtService, 'sign').mockReturnValue('jwt_token');

      const result = await authService.signUp(createUserDto);
      expect(result).toEqual({ token: 'jwt_token' });
    });
  });

  describe('login', () => {
    it('should throw NotFoundException if user is not found', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      mockUsersService.findOneByEmail.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if password is invalid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      const user: User = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed_password',
      } as User;

      mockUsersService.findOneByEmail.mockResolvedValue(user);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      await expect(authService.login(loginDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return a token if login is successful', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      const user: User = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed_password',
      } as User;

      mockUsersService.findOneByEmail.mockResolvedValue(user);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));
      jest.spyOn(jwtService, 'sign').mockReturnValue('jwt_token');

      const result = await authService.login(loginDto);
      expect(result).toEqual({ token: 'jwt_token' });
    });
  });
});
