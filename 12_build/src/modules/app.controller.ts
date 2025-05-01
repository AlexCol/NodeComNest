import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor() { }

  @Get()
  async getHello(
    @Req() req: Request
  ) {
    const now = new Date();
    console.log(`Requisição recebida: ${now.toISOString()} de IP ${req.ip}`);
    //await delay(30000);
    return 'OK';
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

