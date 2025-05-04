import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req
} from '@nestjs/common';
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { FastifyRequest } from 'fastify';
import { TokenPayloadParam } from '../auth/params/token-payload.param';
import { TokenPayloadDto } from '../auth/dto/token-payload.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
@Controller('recados')
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) { }

  @Get()
  @ApiBearerAuth()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '0',
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    const { id: userId } = tokenPayload;
    return await this.recadosService.findAll(userId, parseInt(page), parseInt(limit));
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    const { id: userId } = tokenPayload;
    return await this.recadosService.findById(userId, id);
  }

  @Post()
  async create(
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
    @Body() body: CreateRecadoDto
  ) {
    const { id: userId } = tokenPayload;
    return await this.recadosService.create(userId, body);
  }

  @Put(':id')
  async updatePut(
    @Param('id') id: number,
    @Body() body: UpdateRecadoDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    const { id: userId } = tokenPayload;
    return await this.recadosService.update(userId, id, body);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
    @Body() body: UpdateRecadoDto
  ) {
    const { id: userId } = tokenPayload;
    var retorno = await this.recadosService.update(userId, id, body);
    return retorno;
  }

  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    const { id: userId } = tokenPayload;
    const recado = await this.recadosService.remove(userId, id);
    return { message: `Recado ${id} removido com sucesso`, ...recado };
  }
}
