// backend/src/auth/auth.controller.ts
import { Body, Controller, Get, Post, Query, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

// DTOs for validation
class RegisterDto { 
  username!: string; 
  email!: string; 
  password!: string; 
}

class LoginDto { 
  email!: string; 
  password!: string; 
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.username, dto.email, dto.password);
  }

  @Get('verify')
  verify(@Query('token') token: string) {
    return this.auth.verifyEmail(token);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  // Thêm endpoint để lấy thông tin profile user
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.auth.getProfile(req.user.sub);
  }

  // Endpoint để refresh token (tùy chọn)
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    return this.auth.refreshToken(req.user.sub);
  }
}