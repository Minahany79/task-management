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
    const taskInDb = await this.taskRepository.findOne({
      where: { id: taskId, user: { id: userId } },
    });
    if (!taskInDb) {
      throw new NotFoundException(`Cannot find the requested task`);
    }
    return this.taskRepository.update(
      { id: taskId, user: { id: userId } },
      updateTaskDto,
    );
  }

  async remove(taskId: number, userId: number) {
    const taskInDb = await this.taskRepository.findOne({
      where: { id: taskId, user: { id: userId } },
    });

    if (!taskInDb) {
      throw new NotFoundException(`Cannot find the requested task`);
    }
    return this.taskRepository.delete({ id: taskId, user: { id: userId } });
  }

  async updateTaskStatus(taskId: number, userId: number) {
    const taskInDb = await this.taskRepository.findOne({
      where: { id: taskId, user: { id: userId } },
    });
    if (!taskInDb) {
      throw new NotFoundException(`Cannot find the requested task`);
    }
    return this.taskRepository.update(taskId, {
      status: TaskStatus.Completed,
    });
  }
}
