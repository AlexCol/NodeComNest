import { forwardRef, Module } from '@nestjs/common';
import { RecadosService } from './recados.service';
import { RecadosController } from './recados.controller';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recado } from './entities/recado.entity';
import { Utils, UtilsMock } from 'src/common/util/ExemploDI.teste';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recado]),
    //PessoasModule //?ver comentários no pessoasModule
    forwardRef(() => PessoasModule)
  ],
  controllers: [RecadosController],
  providers: [
    RecadosService, //forma curta (somente se provide e useClass forem iguais)
    { //forma mais longa
      provide: Utils, // como se fosse a 'Interface'
      useClass: Utils // a classe concreta que vai ser usada
    }
  ],
  // Apenas exportando o token (a implementação já foi definida acima)
  exports: [Utils] //não adianta usar provide e useClass, pois ele vai seguir o que tem no provides
})
export class RecadosModule { }
