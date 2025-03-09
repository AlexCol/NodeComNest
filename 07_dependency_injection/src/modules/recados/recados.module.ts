import { forwardRef, Module } from '@nestjs/common';
import { RecadosService } from './recados.service';
import { RecadosController } from './recados.controller';
import { PessoasModule } from 'src/modules/pessoas/pessoas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recado } from './entities/recado.entity';
import { Utils, UtilsMock } from 'src/common/util/ExemploDI.teste';
import { ONLY_LOWERCASE_LETTERS_REGEX, REMOVE_SPACES_REGEX, SERVER_NAME } from 'src/common/constants/server-name.constant';
import { RegexProtocol } from 'src/common/regex/regex.protocol';
import { RemoveSpacesRegex } from 'src/common/regex/remove-spaces.regex';
import { OnlyLowercaseLettersRegex } from 'src/common/regex/only-lowercase-letters.regex';

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
    },
    {
      provide: SERVER_NAME, //exemplo para usar string como token
      useValue: 'my-localhost' //para usar, precisa importar o token e usar o @Inject (exemplo no RecadosController)
    },
    // {
    //   provide: RegexProtocol,
    //   useClass: OnlyLowercaseLettersRegex
    // }
    {
      provide: ONLY_LOWERCASE_LETTERS_REGEX,
      useClass: OnlyLowercaseLettersRegex
    },
    {
      provide: REMOVE_SPACES_REGEX,
      useClass: RemoveSpacesRegex
    }
  ],
  // Apenas exportando o token (a implementação já foi definida acima)
  exports: [Utils, SERVER_NAME] //não adianta usar provide e useClass, pois ele vai seguir o que tem no provides
})
export class RecadosModule { }
