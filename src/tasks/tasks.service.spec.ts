import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { TaskStatus } from './enums/task-status';

const mockTaskRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('TasksService', () => {
  let service: TasksService;
  let repository: Repository<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useFactory: mockTaskRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a task', async () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Desc',
        userId: 1,
      };
      const userId = 1;
      (repository.save as jest.Mock).mockResolvedValue({
        id: 1,
        ...createTaskDto,
      });

      const result = await service.create(createTaskDto);
      expect(result).toEqual({ id: 1, ...createTaskDto });
      expect(repository.save).toHaveBeenCalledWith({
        ...createTaskDto,
        user: { id: userId },
      });
    });
  });

  describe('findAll', () => {
    it('should return all tasks for a user', async () => {
      const userId = 1;
      const mockTasks = [
        {
          id: 1,
          title: 'Test Task',
          description: 'Test Desc',
          user: { id: userId },
        },
      ];
      (repository.find as jest.Mock).mockResolvedValue(mockTasks);

      const result = await service.findAll(userId);
      expect(result).toEqual(mockTasks);
      expect(repository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
      });
    });
  });

  describe('findOne', () => {
    it('should find a task by id', async () => {
      const taskId = 1;
      const userId = 1;
      const mockTask = {
        id: taskId,
        title: 'Test Task',
        description: 'Test Desc',
        user: { id: userId },
      };
      (repository.findOne as jest.Mock).mockResolvedValue(mockTask);

      const result = await service.findOne(taskId, userId);
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException if no task is found', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      expect(service.findOne(1, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const taskId = 1;
      const userId = 1;
      const updateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Desc',
      };
      (repository.update as jest.Mock).mockResolvedValue({ affected: 1 });

      await service.update(updateTaskDto, taskId, userId);
      expect(repository.update).toHaveBeenCalledWith(
        { id: taskId, user: { id: userId } },
        updateTaskDto,
      );
    });

    it('should throw NotFoundException if the task does not exist', async () => {
      (repository.update as jest.Mock).mockResolvedValue({ affected: 0 });

      expect(service.update({ title: 'Updated Task' }, 1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a task', async () => {
      (repository.delete as jest.Mock).mockResolvedValue({ affected: 1 });

      await service.remove(1, 1);
      expect(repository.delete).toHaveBeenCalledWith({
        id: 1,
        user: { id: 1 },
      });
    });

    it('should throw NotFoundException if no task is found', async () => {
      (repository.delete as jest.Mock).mockResolvedValue({ affected: 0 });

      expect(service.remove(1, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTaskStatus', () => {
    it('should mark task as completed', async () => {
      (repository.update as jest.Mock).mockResolvedValue({ affected: 1 });

      await service.updateTaskStatus(1, 1);
      expect(repository.update).toHaveBeenCalledWith(
        { id: 1, user: { id: 1 } },
        { status: TaskStatus.Completed },
      );
    });

    it('should throw NotFoundException if no task is found', async () => {
      (repository.update as jest.Mock).mockResolvedValue({ affected: 0 });

      expect(service.updateTaskStatus(1, 1)).rejects.toThrow(NotFoundException);
    });
  });
});
