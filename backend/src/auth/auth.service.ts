import { Injectable, BadRequestException, UnauthorizedException, Logger, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(username: string, email: string, password: string) {
    try {
  
      const existingUser = await this.prisma.user.findFirst({ 
        where: { 
          OR: [
            { email: email },
            { username: username }
          ] 
        } 
      });

      if (existingUser) {
        if (existingUser.email === email) {
          throw new BadRequestException('Email đã được sử dụng');
        }
        if (existingUser.username === username) {
          throw new BadRequestException('Tên người dùng đã được sử dụng');
        }
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Tạo verification token
      const verificationToken = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
      const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

      // Tạo user mới
      const user = await this.prisma.user.create({
        data: { 
          username, 
          email, 
          password: hashedPassword, 
          verificationToken, 
          verificationTokenExpires, 
          isVerified: false,
          role: UserRole.USER,
        },
      });

      this.logger.log(`User registered: ${email}`);
      this.logger.debug(`Verification token for ${email}: ${verificationToken}`);
      
      // Trả về user không có password
      const { password: _, verificationToken: __, verificationTokenExpires: ___, ...result } = user;
      return result;

    } catch (error) {
      this.logger.error(`Registration failed for ${email}:`, error.message);
      
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      // Log chi tiết lỗi để debug
      this.logger.error('Full error:', error);
      throw new InternalServerErrorException('Có lỗi xảy ra khi tạo tài khoản');
    }
  }

  async verifyEmail(token: string) {
    try {
      const user = await this.prisma.user.findFirst({ where: { verificationToken: token } });
      
      if (!user) {
        throw new BadRequestException('Token không hợp lệ');
      }
      
      if (!user.verificationTokenExpires || user.verificationTokenExpires < new Date()) {
        throw new BadRequestException('Token đã hết hạn');
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: { 
          isVerified: true, 
          verificationToken: null, 
          verificationTokenExpires: null 
        },
      });

      return { ok: true, message: "Email đã được xác thực thành công" };
    } catch (error) {
      this.logger.error('Email verification failed:', error.message);
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      
      if (!user) {
        throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
      }
      
      if (!user.isVerified) {
        this.logger.warn(`Login attempt from unverified email: ${email}`);
        // Trong production, bạn có thể uncomment dòng dưới để bắt buộc verify email
        // throw new UnauthorizedException('Vui lòng xác thực email trước khi đăng nhập');
      }

      const payload = { 
        sub: user.id, 
        userId: user.id, // Thêm userId để dễ sử dụng
        role: user.role, 
        username: user.username 
      };
      
      const token = await this.jwt.signAsync(payload);
      
      return { 
        token, 
        user: { 
          id: user.id, 
          email: user.email, 
          username: user.username, 
          role: user.role,
          isVerified: user.isVerified
        } 
      };
    } catch (error) {
      this.logger.error(`Login failed for ${email}:`, error.message);
      throw error;
    }
  }
}