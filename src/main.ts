import 'dotenv/config';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { AllConfigType } from './config/config.type';
import { ResolvePromisesInterceptor } from './utils/serializer.interceptor';

import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService<AllConfigType>);

  const apiPrefix = configService.getOrThrow('app.apiPrefix', { infer: true }) || 'api';
  const port = configService.getOrThrow('app.port', { infer: true }) || 3001;

  // 1. Global Prefix
  app.setGlobalPrefix(apiPrefix, {
    exclude: ['/'],
  });

  // 2. URI Versioning (/api/v1/...)
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // 3. Static Files Serving (Serves uploads cleanly at /api/v1/files/)
  app.useStaticAssets(join(__dirname, '..', 'files'), {
    prefix: `/${apiPrefix}/v1/files/`,
  });

  // 4. CORS Setup (Ensures Cookie authentication & Next.js origin work smoothly)
  const frontendDomain = configService.get('app.frontendDomain', { infer: true });
  const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    frontendDomain,
  ].filter((origin): origin is string => typeof origin === 'string' && origin.length > 0);

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Crucial for passing 'auth_token' cookies
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
      'x-custom-lang',
      'X-Requested-With',
    ],
  });

  app.enableShutdownHooks();

  // 5. Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true, // Enables automatic DTO type conversion (e.g. string to number)
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 6. Increased Payload Size for Media Uploads
  app.use(json({ limit: '100mb' }));
  app.use(urlencoded({ limit: '100mb', extended: true }));

  // 7. Global Interceptors
  app.useGlobalInterceptors(
    new ResolvePromisesInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  // 8. Swagger Documentation Setup
  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addGlobalParameters({
      in: 'header',
      required: false,
      name: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
      schema: {
        example: 'en',
      },
    })
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}/${apiPrefix}/v1`);
}

void bootstrap();