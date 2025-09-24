// backend/src/common/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();

      if (typeof errorResponse === 'string') {
        message = errorResponse;
      } else if (typeof errorResponse === 'object' && errorResponse !== null) {
        // Xử lý lỗi validation từ class-validator
        const errorObj = errorResponse as any;
        if (errorObj.message) {
          message = Array.isArray(errorObj.message)
            ? errorObj.message
            : [errorObj.message];
        }
      }
    }

    // Format lại response để dễ đọc hơn
    response.status(status).json({
      statusCode: status,
      message: message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
