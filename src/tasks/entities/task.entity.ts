import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { TaskStatus } from '../enums/task-status';
import { User } from '../../users/entities/user.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.Pending,
  })
  status!: TaskStatus;

  @Column()
  dueDate!: Date;

  @Column()
  @CreateDateColumn()
  creationDate!: Date;

  @Column()
  @UpdateDateColumn()
  modificationDate!: Date;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  user!: User;
}
