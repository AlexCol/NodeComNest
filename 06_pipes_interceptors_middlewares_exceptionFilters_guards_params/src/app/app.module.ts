import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecadosModule } from 'src/recados/recados.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { SimpleMiddleware } from 'src/common/middlewares/simple.middleware';
import { APP_FILTER } from '@nestjs/core';
import { MyExceptionFilter } from 'src/common/exceptionFiltes/my-exception.filter';
import { GlobalExceptionFilter } from 'src/common/exceptionFiltes/global-exception.filter';

@Module({
  imports: [
    //docker run -d --name postgreAulaNest -e POSTGRES_USER=root -e POSTGRES_PASSWORD=nest@852ad -e POSTGRES_DB=nest -p 5432:5432 --restart always postgres
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'root',
      password: 'nest@852ad',
      database: 'nest',
      autoLoadEntities: true, //carrega automaticamente as entidades
      synchronize: true //sincroniza o banco de dados com as entidades, não usar em produção
    }),
    RecadosModule,
    PessoasModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: GlobalExceptionFilter }, //ordem importa, o ultimo registrado é o primeiro a ser chamado
    { provide: APP_FILTER, useClass: MyExceptionFilter },
  ],
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    //consumer.apply(SimpleMiddleware).forRoutes('*');
    /*
    consumer.apply(SimpleMiddleware).forRoutes({ //cuidado, usar Middlewares com Fastify após o Next as responses viram do Express
      path: 'recados/:id', //'*' para todos
      method: RequestMethod.ALL //ou pode-se esecificar o método
    });
    //*/
  }
}
