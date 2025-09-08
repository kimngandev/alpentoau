// backend/src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // BỔ SUNG: Cho phép frontend (từ mọi nguồn) có thể gọi API
  app.enableCors();

  // BỔ SUNG: Thêm tiền tố '/api' cho tất cả các route
  // Ví dụ: /genres -> /api/genres
  app.setGlobalPrefix('api');

  await app.listen(3001);
}
bootstrap();
