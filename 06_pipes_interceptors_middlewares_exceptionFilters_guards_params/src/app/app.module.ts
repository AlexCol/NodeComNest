import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecadosModule } from 'src/recados/recados.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { SimpleMiddleware } from 'src/common/middlewares/simple.middleware';

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
  providers: [AppService],
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    //consumer.apply(SimpleMiddleware).forRoutes('*');
    consumer.apply(SimpleMiddleware).forRoutes({
      path: 'recados/:id', //'*' para todos
      method: RequestMethod.ALL //ou pode-se esecificar o método
    });
  }
}
