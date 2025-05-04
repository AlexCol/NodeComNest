import { Module } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recado } from './entities/recado.entity';
import { PessoasModule } from '../pessoas/pessoas.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recado]),
    PessoasModule,
    EmailModule
  ],
  controllers: [RecadosController],
  providers: [RecadosService],
})
export class RecadosModule { }
