import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserPayload } from 'src/common/interfaces/user.interface';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll(@CurrentUser() user: UserPayload) {
    return this.tasksService.findAll(user.userId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserPayload,
  ) {
    return this.tasksService.findOne(id, user.userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.tasksService.update(updateTaskDto, id, user.userId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserPayload,
  ) {
    return this.tasksService.remove(id, user.userId);
  }

  @Patch(':id/complete')
  markTaskAsCompleted(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserPayload,
  ) {
    return this.tasksService.updateTaskStatus(id, user.userId);
  }
}
