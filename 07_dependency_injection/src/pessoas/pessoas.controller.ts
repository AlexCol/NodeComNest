import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PessoasService } from './pessoas.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { Utils } from 'src/common/util/ExemploDI.teste';

@Controller('pessoas')
export class PessoasController {
  constructor(
    private readonly pessoasService: PessoasService,
    private readonly utils: Utils
  ) { }

  @Post()
  async create(@Body() createPessoaDto: CreatePessoaDto) {
    return this.pessoasService.create(createPessoaDto);
  }

  @Get()
  async findAll(
    @Query() query: any
  ) {
    const { page, limit } = query;
    console.log(`Usando utils no controller pessoas, invertendo 'Best': ${this.utils.inverteString('Best')}`);
    return this.pessoasService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.pessoasService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePessoaDto: UpdatePessoaDto) {
    return this.pessoasService.update(+id, updatePessoaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const pessoaDeletada = await this.pessoasService.remove(id);
    return { message: `Pessoa com id ${id} deletada com sucesso`, pessoa: pessoaDeletada };
  }
}
