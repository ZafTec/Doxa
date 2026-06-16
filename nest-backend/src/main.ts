import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS for the local web dev server. Add prod origins via WEB_ORIGINS
  // (comma-separated). No credentials in v1 since the storefront is
  // guest-only.
  const extras = (process.env.WEB_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'http://127.0.0.1:3001',
      ...extras,
    ],
    credentials: false,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
