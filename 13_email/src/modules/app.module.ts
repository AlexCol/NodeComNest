import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigTypeOrm } from 'src/database/ConfigTypeOrm';
import { RecadosModule } from './recados/recados.module';
import { PessoasModule } from './pessoas/pessoas.module';
import { ColorsModule } from './colors/colors.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { NotFoundFilter } from 'src/common/excpetionFilters/notFoundFilter.filter';
import { EmailModule } from './email/email.module';

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
    AuthModule,
    EmailModule, //por ser global, não precisa ser importado em nenhum outro módulo
  ],
  providers: [
    { provide: APP_FILTER, useClass: NotFoundFilter },
  ]
})
export class AppModule { }
