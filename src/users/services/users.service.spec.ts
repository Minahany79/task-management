import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';

const mockUserRepository = () => ({
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository(),
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('10') },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should successfully create a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John',
        email: 'john@example.com',
        password: 'strongPassword123',
      };

      (repository.save as jest.Mock).mockResolvedValue(createUserDto);

      const result = await service.create(createUserDto);
      expect(result).toEqual(createUserDto);
      expect(repository.save).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findOne', () => {
    it('should find a user by id', async () => {
      const user = { id: 1, email: 'test@example.com' };

      (repository.findOne as jest.Mock).mockResolvedValue(user);
      const result = await service.findOne(1);

      expect(result).toEqual(user);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if user is not found', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneByEmail', () => {
    it('should find a user by email', async () => {
      const user = { id: 1, email: 'test@example.com' };

      (repository.findOne as jest.Mock).mockResolvedValue(user);
      const result = await service.findOneByEmail('test@example.com');

      expect(result).toEqual(user);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: ILike('test@example.com') },
      });
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      (repository.delete as jest.Mock).mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);
      expect(result).toEqual({ affected: 1 });
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if no user is affected', async () => {
      (repository.delete as jest.Mock).mockResolvedValue({ affected: 0 });

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
