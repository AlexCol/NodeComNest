import { Module } from '@nestjs/common';
import { ConceitosAutomaticoController } from './conceitos-automatico.controller';
import { ConceitosAutomaticoService } from './conceitos-automatico.service';

@Module({
  providers: [ConceitosAutomaticoService],
  controllers: [ConceitosAutomaticoController]
})
export class ConceitosAutomaticoModule { }
