import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export function Serialize<T>(dto: ClassConstructor<T>) {
  return UseInterceptors(new SerializerInterceptor<T>(dto));
}
class SerializerInterceptor<T> implements NestInterceptor {
  constructor(private dto: ClassConstructor<T>) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    return next.handle().pipe(
      map((data: any) => {
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
