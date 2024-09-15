import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskStatus } from './enums/task-status';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  create(createTaskDto: CreateTaskDto) {
    return this.taskRepository.save({
      ...createTaskDto,
      user: { id: createTaskDto.userId },
    });
  }

  findAll(userId: number) {
    return this.taskRepository.find({ where: { user: { id: userId } } });
  }

  findOne(taskId: number, userId: number) {
    return this.taskRepository.findOne({
      where: { id: taskId, user: { id: userId } },
    });
  }

  async update(updateTaskDto: UpdateTaskDto, taskId: number, userId: number) {
    const result = await this.taskRepository.update(
      { id: taskId, user: { id: userId } },
      updateTaskDto,
    );
    if (result.affected === 0) {
      throw new NotFoundException(`Cannot find the requested task`);
    }

    return result;
  }

  async remove(taskId: number, userId: number) {
    const result = await this.taskRepository.delete({
      id: taskId,
      user: { id: userId },
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Cannot find the requested task`);
    }

    return result;
  }

  async updateTaskStatus(taskId: number, userId: number) {
    const result = await this.taskRepository.update(
      { id: taskId, user: { id: userId } },
      {
        status: TaskStatus.Completed,
      },
    );
    if (result.affected === 0) {
      throw new NotFoundException(`Cannot find the requested task`);
    }

    return result;
  }
}
