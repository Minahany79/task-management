import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { TasksModule } from './tasks/tasks.module';
import { JwtModule } from '@nestjs/jwt';

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
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('TOKEN_EXPIRY_DURATION_IN_DAYS'),
        },
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
