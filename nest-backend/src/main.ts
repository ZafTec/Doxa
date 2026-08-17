// Must run before any other import: modules like AuthModule read
// process.env at @Module decorator evaluation time (i.e. at import time,
// before ConfigModule.forRoot() gets a chance to load .env), so .env has to
// be loaded before AppModule (and its whole import graph) is pulled in.
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  // CORS for the local web dev server. Add prod origins via WEB_ORIGINS
  // (comma-separated). Credentials are enabled so the admin auth cookie
  // can flow between the web app origin and this API.
  const extras = (process.env.WEB_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  app.enableCors({
    origin: ['http://localhost:3001', 'http://127.0.0.1:3001', ...extras],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
