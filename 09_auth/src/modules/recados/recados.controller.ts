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
import { REQUEST_TOKEN_PAYLOAD_KEY } from '../auth/auth.constants';

@Controller('recados')
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) { }
  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '0',
    @Req() request: FastifyRequest
  ) {
    const payload = request[REQUEST_TOKEN_PAYLOAD_KEY];
    if (payload) {
      console.log(payload.id);
      console.log(payload.outraPropriedade);
      console.log(payload);
    }
    return await this.recadosService.findAll(parseInt(page), parseInt(limit));
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
