// backend/src/auth/jwt-auth.guard.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: any) {
    // Xử lý các lỗi JWT
    if (err || !user) {
      if (info) {
        // Xử lý các loại lỗi JWT phổ biến
        if (info.name === 'TokenExpiredError') {
          throw new UnauthorizedException(
            'Token đã hết hạn. Vui lòng đăng nhập lại.',
          );
        }
        if (info.name === 'JsonWebTokenError') {
          throw new UnauthorizedException('Token không hợp lệ.');
        }
        if (info.name === 'NotBeforeError') {
          throw new UnauthorizedException('Token chưa có hiệu lực.');
        }
        if (info.message) {
          throw new UnauthorizedException(`Lỗi xác thực: ${info.message}`);
        }
      }

      throw new UnauthorizedException('Vui lòng đăng nhập để tiếp tục.');
    }

    return user;
  }
}
