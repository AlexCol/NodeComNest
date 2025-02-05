import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
//import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('PORT:', process.env.PORT); // Verifique se imprime o valor correto
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
