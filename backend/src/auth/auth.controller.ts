import { 
  Body, 
  Controller, 
  Get, 
  Post, 
  Query, 
  HttpCode, 
  HttpStatus,
  Logger 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, VerifyEmailDto } from './dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    this.logger.log(`Registration attempt for user: ${dto.username}, email: ${dto.email}`);
    
    try {
      const result = await this.auth.register(dto.username, dto.email, dto.password);
      this.logger.log(`User registered successfully: ${dto.email}`);
      return result;
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`);
      throw error;
    }
  }

  @Get('verify')
  @HttpCode(HttpStatus.OK)
  async verify(@Query() dto: VerifyEmailDto) {
    this.logger.log(`Email verification attempt with token: ${dto.token?.substring(0, 8)}...`);
    return this.auth.verifyEmail(dto.token);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    this.logger.log(`Login attempt for email: ${dto.email}`);
    
    try {
      const result = await this.auth.login(dto.email, dto.password);
      this.logger.log(`User logged in successfully: ${dto.email}`);
      return result;
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`);
      throw error;
    }
  }

  // Test endpoint để kiểm tra auth controller hoạt động
  @Get('test')
  @HttpCode(HttpStatus.OK)
  test() {
    this.logger.log('Auth test endpoint called');
    return { 
      message: 'Auth controller is working!', 
      timestamp: new Date().toISOString(),
      routes: [
        'POST /api/auth/register',
        'POST /api/auth/login',
        'GET /api/auth/verify',
        'GET /api/auth/test'
      ]
    };
  }
}