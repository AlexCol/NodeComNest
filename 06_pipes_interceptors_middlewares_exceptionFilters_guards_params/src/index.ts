import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { ParseIntIdPipe } from './common/customPipes/parse-int-id';
import { AddHeaderInterceptor } from './common/interceptors/add-header.interceptor';
import { TimingConnectionInterceptor } from './common/interceptors/timing-connection.interceptor';
import { ErrorHandlerInterceptor } from './common/interceptors/error-handler.interceptor';
import { SimpleCacheInterceptor } from './common/interceptors/simple-cache.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, //elimina do json de entrada valores que não estão no DTO
    forbidNonWhitelisted: true, //emite erro se houver valores não permitidos
    transform: true, //como 'true' tenta transformar os tipos das variáveis de entrada para os tipos definidos no DTO
  }),
    new ParseIntIdPipe() //exemplo de uso de customPipe global
  );

  app.useGlobalInterceptors(
    new AddHeaderInterceptor(),
    new TimingConnectionInterceptor(),
    new ErrorHandlerInterceptor(),
    new SimpleCacheInterceptor(),
  ); //interceptor global

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
