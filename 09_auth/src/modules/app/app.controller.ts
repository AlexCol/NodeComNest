import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { get } from 'http';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('env')
  getDotEnv(): string {
    return this.appService.getDotEnv();
  }

  @Get('param-number/:key')
  getKeyNumber(
    @Param('key') key: number
  ): string {
    return `Key: ${key} its type is: <${typeof key}>. if you are using ValidationPipe it should be <number>, otherwise it will be a <string>`;
  }
}
