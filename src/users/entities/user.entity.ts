import { Task } from '../../tasks/entities/task.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  @CreateDateColumn()
  creationDate!: Date;

  @Column()
  @UpdateDateColumn()
  modificationDate!: Date;

  @OneToMany(() => Task, (task) => task.user)
  tasks!: Task[];
}
