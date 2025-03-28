import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //! apesar de se poder adicionar aqui os global filters e guards, é recomendado que sejam adicionados no AppModule
  //? pois assim se consegue aproveitar a injeção de dependências, já que aqui é necessário criar uma instância manualmente
  //* ex. app.useGlobalFilters(new GlobalErrorFilter(), new HttpErrorFilter());

  //! tipo especial de Pipe, que pode aplicar vários ajustes com poucas configurações
  //! necessário class-validator e class-transformer
  // app.useGlobalPipes(new ValidationPipe({
  //   whitelist: true,
  //   forbidNonWhitelisted: true,
  //   //transform: true,
  // }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
