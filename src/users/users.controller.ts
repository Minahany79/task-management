import {
  Controller,
  Post,
  Body,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './services/users.service';
import { AuthService } from './services/auth.service';
import { LoginDto } from './dto/login.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserPayload } from 'src/common/interfaces/user.interface';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Patch()
  @Serialize(UserDto)
  update(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.usersService.update(updateUserDto, user.userId);
  }

  @Delete()
  remove(@CurrentUser() user: UserPayload) {
    return this.usersService.remove(user.userId);
  }

  @Get('/current')
  @Serialize(UserDto)
  getCurrentUser(@CurrentUser() user: UserPayload) {
    return this.usersService.getUserById(user.userId);
  }
}
