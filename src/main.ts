import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('API Aluguel de Carros (Guardians)')
    .setDescription('Documentação da API para o teste técnico (Happmobi)')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application listening on port ${port}`);
}
bootstrap();