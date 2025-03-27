import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigTypeOrm } from 'src/Database/ConfigTypeOrm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Importa o ConfigModule para resolver dependências
      // Usa a classe ConfigTypeOrm para fornecer as configurações
      useClass: ConfigTypeOrm,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
