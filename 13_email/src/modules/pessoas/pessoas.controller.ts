import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException, Put } from '@nestjs/common';
import { PessoasService } from './pessoas.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { TokenPayloadParam } from '../auth/params/token-payload.param';
import { TokenPayloadDto } from '../auth/dto/token-payload.dto';
import { IsPublic } from '../auth/guards/is-public';
import { ERole, RolePolicy } from '../auth/guards/role-policy';

@Controller('pessoas')
export class PessoasController {
  constructor(private readonly pessoasService: PessoasService) { }

  @IsPublic()
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
  async findOne(@Param('id') id: number) {
    return await this.pessoasService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePessoaDto: UpdatePessoaDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    if (tokenPayload.id !== +id)
      throw new BadRequestException('Você não tem permissão para atualizar essa pessoa');
    return this.pessoasService.update(+id, updatePessoaDto);
  }

  @RolePolicy(ERole.admin)
  @Put(':id')
  async updateForAdmin(
    @Param('id') id: number,
    @Body() updatePessoaDto: UpdatePessoaDto
  ) {
    return this.pessoasService.update(+id, updatePessoaDto);
  }
  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    if (tokenPayload.id !== id)
      throw new BadRequestException('Você não tem permissão para excluir essa pessoa');

    const pessoaDeletada = await this.pessoasService.remove(id);
    return { message: `Pessoa com id ${id} deletada com sucesso`, pessoa: pessoaDeletada };
  }
}
