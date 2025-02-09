import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { RecadosService } from './recados.service';
import { Recado } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';

@Controller('recados')
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) { }
  @Get()
  findAll(
    @Query() query: any
  ) {
    const { page, limit } = query;
    return this.recadosService.findAll(page, limit);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string
  ) {
    return this.recadosService.findById(Number(id));
  }

  @Post()
  create(@Body() body: CreateRecadoDto) {
    return this.recadosService.create(body);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateRecadoDto
  ) {
    var retorno = this.recadosService.update(Number(id), body);
    return retorno;
  }

  @Delete(':id')
  remove(
    @Param('id') id: string
  ) {
    const recado = this.recadosService.remove(Number(id));
    return { message: `Recado ${id} removido com sucesso`, ...recado };
  }
}

/* exemplos anteriores

  @Get()
  findAll() {
    return 'Retorna todos os recados';
  }

  @Get('fixa/:dinamico/:id')
  findOne(@Param('dinamico') dinamico: string, @Param('id') id: string) {
    return `Retorna um recado: ${id} e passou dinamico como ${dinamico}`;
  }

  @Get('pagina')
  getPaginacao(
    @Query('pagina') pagina: number,
    @Query('limite') limite: number,
  ) {
    return `Pagina: ${pagina} e Limite: ${limite}`;
  }

  @Get('pagina2')
  getPaginacao2(@Query() query: any) {
    //const { pagina, limite = 10 } = query;
    return query;
  }

  @Get('from-service')
  getHelloFromService() {
    return this.recadosService.getHello();
  }

  @HttpCode(HttpStatus.I_AM_A_TEAPOT) //enum do status code
  @Get('testeParam/:par1/:par2')
  findTwo(
    @Param() parametros: any, //util para mais de um parametro
  ) {
    const { par1, par2 } = parametros; //então podemos desestruturar
    return `Parametros informados: ${par1} e ${par2}`;
  }

  @Post()
  create(@Body() body: any) {
    //const { recado } = body;
    return body;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: IRecado, //testando tipar o body
  ) {
    return `Atualiza o recado ${id} com o corpo ${body.recado}`;
  }

  @HttpCode(204)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Res() response: Response, //teste usando a response do express
  ) {
    response.status(200).json({ message: `Recado ${id} removido com sucesso` });
    //return `Remove o recado ${id}`;
  }

  type IRecado = { //fora da classe
    recado: string;
  };
*/
