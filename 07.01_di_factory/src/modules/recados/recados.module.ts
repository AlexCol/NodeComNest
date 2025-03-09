import { forwardRef, Module } from '@nestjs/common';
import { RecadosService } from './recados.service';
import { RecadosController } from './recados.controller';
import { PessoasModule } from 'src/modules/pessoas/pessoas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recado } from './entities/recado.entity';
import { Utils } from 'src/common/util/ExemploDI.teste';
import { RegexFactory } from 'src/common/regex/regex.factory';
import { REMOVE_SPACES_REGEX } from 'src/common/constants/server-name.constant';
import { RemoveSpacesRegex } from 'src/common/regex/remove-spaces.regex';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recado]),
    //PessoasModule //?ver comentários no pessoasModule
    forwardRef(() => PessoasModule)
  ],
  controllers: [RecadosController], //mais exemplos para DI na pasta 07_dependency_injection (aqui foi limpo para continuar as aulas)
  providers: [
    RecadosService,
    Utils,
    RegexFactory,
    {
      provide: REMOVE_SPACES_REGEX,
      inject: [RegexFactory], //vai injetar o RegexFactory na função abaixo
      useFactory: (regexFactory: RegexFactory) => {
        return regexFactory.create('RemoveSpacesRegex');
      },
    }
  ],
  exports: [Utils]
})
export class RecadosModule { }
