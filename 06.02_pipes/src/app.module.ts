import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PipesModule } from './pipes/pipes.module';
import { APP_FILTER } from '@nestjs/core';
import { IsNumberPipe } from './common/pipes/is-number.pipe';

@Module({
  imports: [PipesModule],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule { }
