import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter: nodemailer.Transporter | null = null;
  private from: string;

  constructor(private cfg: ConfigService) {
    // Check if SMTP is configured before creating transporter
    if (this.cfg.get<string>('SMTP_HOST')) {
      this.transporter = nodemailer.createTransport({
        host: this.cfg.get<string>('SMTP_HOST'),
        port: Number(this.cfg.get<string>('SMTP_PORT') || 587),
        secure: this.cfg.get<string>('SMTP_PORT') === '465', // true for 465, false for other ports
        auth: {
          user: this.cfg.get<string>('SMTP_USER'),
          pass: this.cfg.get<string>('SMTP_PASS'),
        },
      });
      this.from = this.cfg.get<string>('SMTP_FROM') || 'noreply@webtruyen.com';
    } else {
        this.logger.warn('SMTP not configured. Emails will not be sent.');
    }
  }

  async sendVerificationEmail(to: string, token: string) {
    if (!this.transporter) {
        this.logger.error(`Cannot send email to ${to}: SMTP transporter is not configured.`);
        return;
    }
    const appUrl = this.cfg.get<string>('APP_URL') || 'http://localhost:3000';
    const verifyUrl = `${appUrl}/verify-email?token=${encodeURIComponent(token)}`;
    
    try {
        const info = await this.transporter.sendMail({
            from: `"Web Truyện" <${this.from}>`,
            to,
            subject: 'Xác thực tài khoản Web Truyện',
            html: `<p>Chào mừng bạn! Vui lòng xác thực email bằng cách nhấp vào liên kết bên dưới:</p><p><a href="${verifyUrl}">Xác thực Email</a></p>`,
        });
        this.logger.log(`Verification email sent to ${to}: ${info.messageId}`);
    } catch (error) {
        this.logger.error(`Failed to send verification email to ${to}`, error.stack);
        throw error; // Re-throw the error to be handled by the caller
    }
  }
}
