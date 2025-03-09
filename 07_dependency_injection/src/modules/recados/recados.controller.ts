import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Utils } from 'src/common/util/ExemploDI.teste';
import { SERVER_NAME } from 'src/common/constants/server-name.constant';
import { RegexProtocol } from 'src/common/regex/regex.protocol';

@Controller('recados')
export class RecadosController {
  constructor(
    private readonly recadosService: RecadosService,

    private readonly utils: Utils,

    @Inject(SERVER_NAME)
    private readonly serverName: string,

    //private readonly regexProtocol: RegexProtocol

    @Inject('ONLY_LOWERCASE_LETTERS_REGEX')
    private readonly onlyLowercaseLettersRegex: RegexProtocol,

    @Inject('REMOVE_SPACES_REGEX')
    private readonly removeSpacesRegex: RegexProtocol
  ) { }
  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto
  ) {
    console.log(`OnlyLowerCaseRegex: ${this.onlyLowercaseLettersRegex.execute('Teste Teste')}`);
    console.log(`RemoveSpacesRegex: ${this.removeSpacesRegex.execute('Teste Teste')}`);
    console.log(`Server name: """${this.serverName}""". Importado via DI`);
    console.log(`Usando utils no controller recados, invertendo 'Best': ${this.utils.inverteString('Best')}`);
    return await this.recadosService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number
  ) {
    return await this.recadosService.findById(id);
  }

  @Post()
  async create(@Body() body: CreateRecadoDto) {
    return await this.recadosService.create(body);
  }

  @Put(':id')
  async updatePut(
    @Param('id') id: number,
    @Body() body: UpdateRecadoDto
  ) {
    return await this.recadosService.update(id, body);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() body: UpdateRecadoDto
  ) {
    var retorno = await this.recadosService.update(id, body);
    return retorno;
  }

  @Delete(':id')
  async remove(
    @Param('id') id: number
  ) {
    const recado = await this.recadosService.remove(id);
    return { message: `Recado ${id} removido com sucesso`, ...recado };
  }
}
