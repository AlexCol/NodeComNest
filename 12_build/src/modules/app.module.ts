import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot({ // Permite 10 requisições a cada 60 segundos (TTL); após isso, novas requisições serão negadas por 5 segundos (blockDuration)
      throttlers: [
        {
          ttl: 60000, //time to live in ms
          limit: 10, // max requests during ttl
          //blockDuration: 5000 //time of block in ms (after that, limit resets) -- if ommited, must wait ttl to reset
        },
      ],
    }),],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule { }
