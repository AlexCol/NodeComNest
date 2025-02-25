import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExemplosModule } from 'src/exemplos/exemplos.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalErrorFilter } from 'src/common/filters/global-error.filter';
import { HttpErrorFilter } from 'src/common/filters/http-error.filter';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { StopWatchInterceptor } from 'src/common/interceptors/stop-watch.interceptor';
import { AddHeaderInterceptor } from 'src/common/interceptors/add-header.interceptor';

@Module({
  imports: [ExemplosModule],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: GlobalErrorFilter }, //?ordem importa, o ultimo registrado é o primeiro a ser chamado
    { provide: APP_FILTER, useClass: HttpErrorFilter },

    { provide: APP_GUARD, useClass: AuthGuard }, //?ordem importa, o primeiro registrado é o primeiro a ser chamado
    { provide: APP_GUARD, useClass: RoleGuard },

    { provide: APP_INTERCEPTOR, useClass: StopWatchInterceptor }, //?ordem importa, o primeiro registrado é o primeiro a ser chamado
    { provide: APP_INTERCEPTOR, useClass: AddHeaderInterceptor },

  ],
})
export class AppModule { }
