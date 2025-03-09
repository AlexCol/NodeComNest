import { forwardRef, Module } from '@nestjs/common';
import { PessoasService } from './pessoas.service';
import { PessoasController } from './pessoas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { RecadosModule } from 'src/modules/recados/recados.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pessoa]),
    //RecadosModule //!como RecadosModule já importa PessoasModule, se importar assim vai dar erro de referencia cirular
    forwardRef(() => RecadosModule) //?se precisar que dois modulos se importem, precisa importar assim, com forwardRef
  ],
  controllers: [PessoasController],
  providers: [PessoasService],
  exports: [PessoasService] //para permitir o uso do servico em outro modulo(Recados) que importar este modulo(Pessoas)
})
export class PessoasModule { }
