import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config'; // تأكد من استيراد هادو
import { JwtStrategy } from './strategies/jwt.strategy';
import { AnonymousStrategy } from './strategies/anonymous.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { MailModule } from '../mail/mail.module';
import { SessionModule } from '../session/session.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    SessionModule,
    PassportModule,
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // إضافة 'as string' أو علامة التعجب للتأكيد
        secret: configService.get<string>('AUTH_JWT_SECRET', { infer: true }),
        signOptions: {
          // الحل هنا: نستخدم Type Casting لـ 'any' أو 'StringValue'
          // ليتوافق مع توقعات مكتبة JWT
          expiresIn:
            (configService.get<string>('AUTH_JWT_TOKEN_EXPIRES_IN', {
              infer: true,
            }) as any) || '1d',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy, AnonymousStrategy],
  exports: [AuthService],
})
export class AuthModule {}
