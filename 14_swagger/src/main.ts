import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, //elimina do json de entrada valores que não estão no DTO
    forbidNonWhitelisted: true, //emite erro se houver valores não permitidos
    transform: true, //como 'true' tenta transformar os tipos das variáveis de entrada para os tipos definidos no DTO
  }));

  const documentBuilderConfig = new DocumentBuilder()
    .setTitle('Recados API')
    .setDescription('Uma Descrição')
    .setVersion('1.0')
    .addBearerAuth() //pra adicinar uso de jwt (cada rota precisa ter o decorator @ApiBearerAuth())
    .build(); // caminho: '/docs'
  //!nest-cli.json adicionado plugin para ler os dtos
  //! criado um responseDto, adicionado no service

  const document = SwaggerModule.createDocument(app, documentBuilderConfig);

  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
