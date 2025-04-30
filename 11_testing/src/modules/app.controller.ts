import { Controller, Get } from "@nestjs/common";
import { IsPublic } from "./auth/guards/is-public";

@Controller()
export class AppController {
  @Get()
  @IsPublic()
  async helloWorld() {
    return 'Hello World!';
  }
}
