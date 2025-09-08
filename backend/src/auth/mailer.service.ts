import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter: nodemailer.Transporter;
  private from: string;

  constructor(cfg: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: cfg.get<string>('SMTP_HOST'),
      port: Number(cfg.get<string>('SMTP_PORT') || 587),
      secure: false,
      auth: {
        user: cfg.get<string>('SMTP_USER'),
        pass: cfg.get<string>('SMTP_PASS'),
      },
    });
    this.from = cfg.get<string>('SMTP_FROM') || 'noreply@example.com';
  }

  async sendVerificationEmail(to: string, token: string) {
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const verifyUrl = `${appUrl}/api/auth/verify?token=${encodeURIComponent(token)}`;
    const info = await this.transporter.sendMail({
      from: this.from,
      to,
      subject: 'Verify your email',
      html: `<p>Please verify your email by clicking the link below:</p><p><a href="${verifyUrl}">Verify Email</a></p>`,
    });
    this.logger.log(`Verification email sent: ${info.messageId}`);
  }
}


