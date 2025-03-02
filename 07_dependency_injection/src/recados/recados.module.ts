import { Module } from '@nestjs/common';
import { RecadosService } from './recados.service';
import { RecadosController } from './recados.controller';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recado } from './entities/recado.entity';
import { Utils } from 'src/common/util/ExemploDI.teste';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recado]),
    PessoasModule
  ],
  controllers: [RecadosController],
  providers: [RecadosService, Utils],
})
export class RecadosModule { }
