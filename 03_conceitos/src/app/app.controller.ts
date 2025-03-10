import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/exemplo')
  getExemplo(): string {
    return 'Exemplo';
  }

  @Get('/novo-exemplo')
  getNovoExemplo(): string {
    return this.appService.getNovoExemplo();
  }
}
