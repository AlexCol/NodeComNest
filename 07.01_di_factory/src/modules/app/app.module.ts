import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecadosModule } from 'src/modules/recados/recados.module';
import { PessoasModule } from 'src/modules/pessoas/pessoas.module';

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
export class AppModule { }
