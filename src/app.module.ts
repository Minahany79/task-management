import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        database: config.get('DB_INSTANCE'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    UsersModule,
    RolesModule,
    TasksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
