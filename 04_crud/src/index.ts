import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, //elimina do json de entrada valores que não estão no DTO
    forbidNonWhitelisted: true, //emite erro se houver valores não permitidos
    transform: false, //como 'true' tenta transformar os tipos das variáveis de entrada para os tipos definidos no DTO
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
