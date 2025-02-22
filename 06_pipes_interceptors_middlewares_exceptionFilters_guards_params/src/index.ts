import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { ParseIntIdPipe } from './common/customPipes/parse-int-id';
import { AddHeaderInterceptor } from './common/interceptors/add-header.interceptor';
import { TimingConnectionInterceptor } from './common/interceptors/timing-connection.interceptor';
import { ErrorHandlerInterceptor } from './common/interceptors/error-handler.interceptor';
import { SimpleCacheInterceptor } from './common/interceptors/simple-cache.interceptor';
import { SimpleMiddleware } from './common/middlewares/simple.middleware';
import { MyExceptionFilter } from './common/exceptionFiltes/my-exception.filter';
import { GlobalExceptionFilter } from './common/exceptionFiltes/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());
  Logger.log(`Adaptador HTTP em uso: ${app.getHttpAdapter().getType()}`, 'Bootstrap');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, //elimina do json de entrada valores que não estão no DTO
    forbidNonWhitelisted: true, //emite erro se houver valores não permitidos
    transform: true, //como 'true' tenta transformar os tipos das variáveis de entrada para os tipos definidos no DTO
  }),
    new ParseIntIdPipe() //exemplo de uso de customPipe global
  );

  app.useGlobalInterceptors(
    new ErrorHandlerInterceptor(), //a ordem importa, então para erro, melhor ser o primeiro
    //new AddHeaderInterceptor(),
    //new TimingConnectionInterceptor(),
    //new SimpleCacheInterceptor(),
  ); //interceptor global

  /*adicionar globalmente o middleware SimpleMiddleware*/ //! acomentado pois será adicionado por modulo, está no AppModule
  //app.use(new SimpleMiddleware().use);

  //! comenatdo aqui, pois outra forma de adicionar, para poder usar a injeçao de dependencia, é colocar no 'modulo raiz'
  // app.useGlobalFilters( //aqui a ordem importa, o ultimo registrado é o primeiro a ser chamado
  //   new GlobalExceptionFilter(),
  //   new MyExceptionFilter(),
  // ); //filtro global

  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
