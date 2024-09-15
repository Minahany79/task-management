import {
  Controller,
  Post,
  Body,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
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
import { AuthGuard } from 'src/common/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdatePasswordDto } from './dto/update-password.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: String,
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request. The user already exists or invalid data was provided.',
  })
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Login successful, JWT token returned.',
    type: String,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid credentials provided.',
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Patch()
  @Serialize(UserDto)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update the currently logged-in user' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or missing token.',
  })
  update(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.usersService.update(updateUserDto, user.userId);
  }

  @Delete()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete the currently logged-in user' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or missing token.',
  })
  remove(@CurrentUser() user: UserPayload) {
    return this.usersService.remove(user.userId);
  }

  @Get('/current')
  @Serialize(UserDto)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get the currently logged-in user' })
  @ApiResponse({
    status: 200,
    description: 'Current user retrieved successfully.',
    type: String,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or missing token.',
  })
  getCurrentUser(@CurrentUser() user: UserPayload) {
    return this.usersService.findOne(user.userId);
  }

  @Patch('/change-password')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Change the currently logged-in user password' })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully.',
    type: UserDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or missing token.',
  })
  changePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.usersService.updatePassword(updatePasswordDto, user.userId);
  }
}
