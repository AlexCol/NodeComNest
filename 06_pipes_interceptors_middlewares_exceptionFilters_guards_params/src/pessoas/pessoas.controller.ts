import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors } from '@nestjs/common';
import { PessoasService } from './pessoas.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { AddHeaderInterceptor } from 'src/common/interceptors/add-header.interceptor';
import { TimingConnectionInterceptor } from 'src/common/interceptors/timing-connection.interceptor';

@Controller('pessoas')
//@UseInterceptors(AddHeaderInterceptor) //pode ser usado no metodo (ou global, adicionei no index - cuidar pois se colocar global e aqui ele vai chamar 2x)
export class PessoasController {
  constructor(private readonly pessoasService: PessoasService) { }

  @Post()
  async create(@Body() createPessoaDto: CreatePessoaDto) {
    return this.pessoasService.create(createPessoaDto);
  }

  @Get()
  async findAll(
    @Query() query: any
  ) {
    const { page, limit } = query;
    return this.pessoasService.findAll(page, limit);
  }

  @Get(':id')
  //@UseInterceptors(AddHeaderInterceptor) //pode ser usado no metodo (ou global, adicionei no index - cuidar pois se colocar global e aqui ele vai chamar 2x)
  async findOne(@Param('id') id: number) {
    console.log('controller - findOne chamado');
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
