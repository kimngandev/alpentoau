// backend/src/main.ts - Thêm debug routes
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set a global prefix for all routes to '/api'
  app.setGlobalPrefix('api');

  // Enable CORS to allow requests from your frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Use ValidationPipe to automatically validate incoming data
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  const server = app.getHttpServer();
  const router = server._events.request._router;

  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
  console.log(`🔗 API Base URL: ${await app.getUrl()}/api`);
  
  // Debug: In ra tất cả routes
  console.log('\n📋 Available routes:');
  console.log('✅ GET /api - Root endpoint');
  console.log('❓ POST /api/auth/register - Register endpoint');
  console.log('❓ POST /api/auth/login - Login endpoint');
  console.log('❓ GET /api/stories - Stories endpoint');
  
  // Test nhanh auth controller
  try {
    const response = await fetch(`${await app.getUrl()}/api/auth/register`, {
      method: 'OPTIONS',
    });
    console.log('✅ Auth routes accessible');
  } catch (error) {
    console.log('❌ Auth routes NOT accessible:', error.message);
  }
}
bootstrap();