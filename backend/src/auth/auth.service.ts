// backend/src/auth/auth.service.ts
import {
  Injectable,
  Logger,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(username: string, email: string, password: string) {
    // Kiểm tra email đã tồn tại
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictException('Email đã được sử dụng');
      }
      if (existingUser.username === username) {
        throw new ConflictException('Tên người dùng đã được sử dụng');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        isVerified: false, // Trong production nên bắt buộc verify email
      },
    });

    this.logger.log(`User registered: ${user.email}`);

    return {
      message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác nhận.',
      userId: user.id,
    };
  }

  async verifyEmail(token: string) {
    // Implement email verification logic here
    // For now, just return success
    return { message: 'Email verified successfully' };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        role: true,
        isVerified: true,
        avatar: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    if (!user.isVerified) {
      // Trong production nên bắt buộc verify email
      this.logger.warn(`Login attempt from unverified email: ${email}`);
      // throw new UnauthorizedException('Vui lòng xác nhận email trước khi đăng nhập');
    }

    const payload = {
      sub: user.id,
      role: user.role,
      username: user.username,
      email: user.email,
    };

    const token = await this.jwt.signAsync(payload);

    this.logger.log(`User logged in: ${user.email}`);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        avatar: user.avatar,
      },
    };
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        avatar: true,
        createdAt: true,
        isVerified: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    return user;
  }

  async refreshToken(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Token không hợp lệ');
    }

    const payload = {
      sub: user.id,
      role: user.role,
      username: user.username,
      email: user.email,
    };

    const token = await this.jwt.signAsync(payload);

    return { token };
  }
}
