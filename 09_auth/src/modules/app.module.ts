import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigTypeOrm } from 'src/Database/ConfigTypeOrm';
import { RecadosModule } from './recados/recados.module';
import { PessoasModule } from './pessoas/pessoas.module';
import { ColorsModule } from './colors/colors.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Importa o ConfigModule para resolver dependências
      // Usa a classe ConfigTypeOrm para fornecer as configurações
      useClass: ConfigTypeOrm,
    }),
    RecadosModule,
    PessoasModule,
    ColorsModule,
    AuthModule, //por ser global, não precisa ser importado em nenhum outro módulo
  ],
})
export class AppModule { }
