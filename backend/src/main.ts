import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'], // Vite default ports
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  console.log('JWT_SECRET:', process.env.JWT_SECRET);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,   // strips extra properties
      forbidNonWhitelisted: true, // error if unknown property
      transform: true,   // transforms string -> number, etc.
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
