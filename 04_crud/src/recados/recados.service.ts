import { Injectable } from '@nestjs/common';

@Injectable()
export class RecadosService {
  getHello(): string {
    return 'Hello World from Service!';
  }
}
