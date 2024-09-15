import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, execution: ExecutionContext) => {
    return execution.switchToHttp().getRequest().user;
  },
);
