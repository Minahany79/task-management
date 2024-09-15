import { Role } from 'src/roles/role.entity';
import { Task } from 'src/tasks/entities/task.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
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

  @ManyToOne(() => Role, (Role) => Role.users, { onDelete: 'CASCADE' })
  role!: Role;

  @OneToMany(() => Task, (task) => task.user)
  tasks!: Task[];
}
