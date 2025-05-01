import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* mais configurações (como adição de pipes), pode ser visto em outros projetos */

  //helmet -: cabeçalhos de segurança no protocolo http
  app.use(helmet());

  // cors -> permitir que outro dominio faça requests na sua aplicação
  app.enableCors({
    origin: '*',
    // https://chatgpt.com/c/68137de5-e3fc-8004-b7cf-37f3617c3b3e
    // credentials: true, //Serve para permitir envio de cookies, headers de autenticação (como Authorization) ou certificados de cliente entre origens diferentes
    // allowedHeaders: ['Content-Type', 'Authorization'], //Define quais headers o navegador pode enviar na requisição CORS. Se o header não estiver na lista, a requisição será bloqueada pelo navegador
    // methods: ['GET', 'POST', 'PUT', 'DELETE'],
    // exposedHeaders: ['Origin-Agent-Cluster'], //Define quais headers da resposta o frontend pode acessar via JavaScript (com fetch ou axios).
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
