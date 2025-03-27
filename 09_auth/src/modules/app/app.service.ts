import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getDotEnv(): string {
    return process.env.MEU_ENV;
  }
}
