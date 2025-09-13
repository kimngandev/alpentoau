import { Injectable, BadRequestException, UnauthorizedException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { MailerService } from './mailer.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly mailer: MailerService,
  ) {}

  async register(username: string, email: string, password: string) {
    const exists = await this.prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
    if (exists) throw new BadRequestException('User with that email or username already exists');

    const hashed = await bcrypt.hash(password, 10);
    const verificationToken = (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).slice(0, 32);
    const verificationTokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

    const user = await this.prisma.user.create({
      data: { 
          username, 
          email, 
          password: hashed, 
          verificationToken, 
          verificationTokenExpires, 
          isVerified: false,
          role: UserRole.USER, // Default role
        },
    });

    try {
        // In a real app, configure your .env and uncomment this to send a verification email.
        // await this.mailer.sendVerificationEmail(email, verificationToken);
        this.logger.log(`Verification token for ${email}: ${verificationToken}`);
    } catch (error) {
        this.logger.error(`Failed to send verification email to ${email}`, error.stack);
        // Decide if you want to throw an error here or just log it
    }
    
    // Omit password from the returned object
    const { password: _, ...result } = user;
    return result;
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({ where: { verificationToken: token } });
    if (!user) throw new BadRequestException('Invalid token');
    if (!user.verificationTokenExpires || user.verificationTokenExpires < new Date()) throw new BadRequestException('Token expired');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verificationToken: null, verificationTokenExpires: null },
    });
    return { ok: true, message: "Email verified successfully." };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    
    if (!user.isVerified) {
        // In production, you should enforce email verification.
        this.logger.warn(`Login attempt from unverified email: ${email}`);
        // throw new UnauthorizedException('Please verify your email before logging in.');
    }

    const payload = { sub: user.id, role: user.role, username: user.username };
    const token = await this.jwt.signAsync(payload);
    
    return { 
        token, 
        user: { id: user.id, email: user.email, username: user.username, role: user.role } 
    };
  }
}

