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
  Query
} from '@nestjs/common';
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';

@Controller('recados')
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) { }
  @Get()
  async findAll(
    @Query() query: any
  ) {
    const { page, limit } = query;
    return await this.recadosService.findAll(page, limit);
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
