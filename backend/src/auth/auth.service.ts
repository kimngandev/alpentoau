import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { MailerService } from './mailer.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly mailer: MailerService,
  ) {}

  async register(username: string, email: string, password: string) {
    const exists = await this.prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
    if (exists) throw new BadRequestException('User already exists');

    const hashed = await bcrypt.hash(password, 10);
    const verificationToken = (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).slice(0, 32);
    const verificationTokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

    const user = await this.prisma.user.create({
      data: { username, email, password: hashed, verificationToken, verificationTokenExpires },
    });

    await this.mailer.sendVerificationEmail(email, verificationToken);
    return { id: user.id, email: user.email, username: user.username };
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({ where: { verificationToken: token } });
    if (!user) throw new BadRequestException('Invalid token');
    if (!user.verificationTokenExpires || user.verificationTokenExpires < new Date()) throw new BadRequestException('Token expired');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verificationToken: null, verificationTokenExpires: null },
    });
    return { ok: true };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    if (!user.isVerified) throw new UnauthorizedException('Email not verified');

    const token = await this.jwt.signAsync({ sub: user.id, role: user.role });
    return { token, user: { id: user.id, email: user.email, username: user.username, role: user.role } };
  }
}


