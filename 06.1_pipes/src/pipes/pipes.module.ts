import { Module } from '@nestjs/common';
import { PipesService } from './pipes.service';
import { PipesController } from './pipes.controller';
import { IsNumberPipe } from 'src/common/pipes/is-number.pipe';
import { APP_PIPE } from '@nestjs/core';

@Module({
  controllers: [PipesController],
  providers: [
    PipesService,
    { provide: APP_PIPE, useClass: IsNumberPipe },
  ],
})
export class PipesModule { }
