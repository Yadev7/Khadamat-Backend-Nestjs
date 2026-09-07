import { Injectable, Logger } from '@nestjs/common';
import fs from 'node:fs/promises';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import { AllConfigType } from '../config/config.type';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter: nodemailer.Transporter;
  private readonly fallbackHosts = ['127.0.0.1', 'localhost'];

  constructor(private readonly configService: ConfigService<AllConfigType>) {
    this.transporter = this.createTransport(
      configService.get('mail.host', { infer: true }),
    );
  }

  private createTransport(host: string | undefined): nodemailer.Transporter {
    return nodemailer.createTransport({
      host: host || '127.0.0.1',
      port: this.configService.get('mail.port', { infer: true }),
      ignoreTLS: this.configService.get('mail.ignoreTLS', { infer: true }),
      secure: this.configService.get('mail.secure', { infer: true }),
      requireTLS: this.configService.get('mail.requireTLS', { infer: true }),
      auth: {
        user: this.configService.get('mail.user', { infer: true }),
        pass: this.configService.get('mail.password', { infer: true }),
      },
      // fail fast so ENOTFOUND doesn't hang request
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
    } as any);
  }

  async sendMail({
    templatePath,
    context,
    ...mailOptions
  }: nodemailer.SendMailOptions & {
    templatePath: string;
    context: Record<string, unknown>;
  }): Promise<void> {
    let html: string | undefined;
    if (templatePath) {
      const template = await fs.readFile(templatePath, 'utf-8');
      html = Handlebars.compile(template, {
        strict: true,
      })(context);
    }

    const from =
      (mailOptions.from as string) ||
      `"${this.configService.get('mail.defaultName', {
        infer: true,
      })}" <${this.configService.get('mail.defaultEmail', {
        infer: true,
      })}>`;

    const trySend = async (transporter: nodemailer.Transporter) => {
      await transporter.sendMail({
        ...mailOptions,
        from,
        html: (mailOptions.html as string) || html,
      });
    };

    try {
      await trySend(this.transporter);
      return;
    } catch (err: any) {
      const code = err?.code || err?.errno;
      const isDnsError =
        code === 'ENOTFOUND' ||
        code === 'EDNS' ||
        err?.syscall === 'getaddrinfo' ||
        /getaddrinfo.*ENOTFOUND/i.test(err?.message || '');

      // If primary host was maildev and DNS failed, retry with localhost fallback (covers local npm start)
      const primaryHost = this.configService.get('mail.host', { infer: true });
      if (isDnsError && primaryHost === 'maildev') {
        for (const fallback of this.fallbackHosts) {
          try {
            this.logger.warn(
              `Mail host "${primaryHost}" not resolvable (${err.message}). Retrying with fallback "${fallback}"...`,
            );
            const fallbackTransport = this.createTransport(fallback);
            await trySend(fallbackTransport);
            this.logger.log(`Mail sent via fallback host "${fallback}"`);
            return;
          } catch (fallbackErr: any) {
            this.logger.warn(
              `Fallback host "${fallback}" also failed: ${fallbackErr.message}`,
            );
            // continue to next fallback
            if (
              fallback === this.fallbackHosts[this.fallbackHosts.length - 1]
            ) {
              err = fallbackErr; // preserve last error
            }
          }
        }
      }

      // For connection refused or other transient errors, don't crash the request - log warning.
      // In development with maildev not running, we still want the DB save to succeed.
      const isConnRefused =
        code === 'ECONNREFUSED' || /ECONNREFUSED/i.test(err?.message || '');
      if (isDnsError || isConnRefused) {
        this.logger.warn(
          `Mail not sent (mail service unavailable: ${err.message}). Message was still saved. ` +
            `Run maildev or configure MAIL_HOST. Skipping email.`,
        );
        // swallow - don't throw, so the calling service can still return success
        // If you want strict delivery in production, uncomment next line:
        // throw err;
        return;
      }

      // For other errors (auth, template, etc.) still throw so caller can log as error
      throw err;
    }
  }
}
