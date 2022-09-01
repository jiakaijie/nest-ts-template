import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    const http = context.switchToHttp();
    const response = http.getResponse();
    response.header(
      'Cache-Control',
      'no-cache, no-store, max-age=0, must-revalidate, value',
    );
    return next.handle().pipe(
      map((data) => {
        return {
          data,
          code: 200,
          msg: '请求成功',
        };
      }),
    );
  }
}
