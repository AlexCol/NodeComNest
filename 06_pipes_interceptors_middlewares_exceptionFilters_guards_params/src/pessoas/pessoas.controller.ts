import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UsePipes, HttpException, BadRequestException } from '@nestjs/common';
import { PessoasService } from './pessoas.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { ChangeDataInterceptor } from 'src/common/interceptors/change-data.interceptor';
import { AuthTokenInterceptor } from 'src/common/interceptors/auth-token.interceptor';

@UseInterceptors(AuthTokenInterceptor)
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
  @UseInterceptors(ChangeDataInterceptor)
  //@UseInterceptors(AddHeaderInterceptor) //pode ser usado no metodo (ou global, adicionei no index - cuidar pois se colocar global e aqui ele vai chamar 2x)
  async findOne(@Param('id') id: number) {
    //console.log('controller - findOne chamado');

    throw new HttpException('Erro proposital', 500);
    //throw new BadRequestException('Erro proposital');

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
