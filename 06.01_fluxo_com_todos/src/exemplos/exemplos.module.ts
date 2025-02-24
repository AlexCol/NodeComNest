import { Module } from '@nestjs/common';
import { ExemplosService } from './exemplos.service';
import { ExemplosController } from './exemplos.controller';
import { APP_PIPE } from '@nestjs/core';
import { IsUuidPipe } from 'src/common/pipes/is-uuid.pipe';

@Module({
  controllers: [ExemplosController],
  providers: [
    ExemplosService,

    /*
    idealmente não usar pipes globais, pois ele vai aplicar para tudo
    ex. o IsNumberPipe vai validar se é numero mesmo que tenha controllers recebendo string
    ex2. pipes bem especificos, pode até ser, ex o IsUuidPipe que é para validar uuid quando parametro for uuid
    */
    //{ provide: APP_PIPE, useClass: IsNumberPipe },
    { provide: APP_PIPE, useClass: IsUuidPipe },
  ],
})
export class ExemplosModule { }
