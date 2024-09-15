import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const CurrentUser = createParamDecorator(
  (data: never, execution: ExecutionContext) => {
    const request = execution.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization;
    const token = authorizationHeader.split(' ')[1];
    try {
      const jwtService = new JwtService();
      return jwtService.decode(token);
    } catch (error: any) {
      throw new UnauthorizedException(error.message);
    }
  },
);
