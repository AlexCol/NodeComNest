import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService, ConfigType } from '@nestjs/config';
import appConfig from './app.config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(appConfig.KEY) private readonly appConfiguration: ConfigType<typeof appConfig>,
  ) { }

  @Get()
  getHello(): string {
    console.log(this.appConfiguration.database.type);
    return this.appService.getHello();
  }
}
