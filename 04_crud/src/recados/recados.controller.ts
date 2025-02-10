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
  Query
} from '@nestjs/common';
import { RecadosService } from './recados.service';
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
    @Param('id') id: number //!transform na pipe para number (index do projeto)
  ) {
    //lembrete: validation pipe transform está desativado, logo aqui vai dar problema
    return this.recadosService.findById(id);
  }

  @Post()
  create(@Body() body: CreateRecadoDto) {
    return this.recadosService.create(body);
  }

  @Patch(':id')
  update(
    @Param('id') id: number, //!transform na pipe para number (index do projeto)
    @Body() body: UpdateRecadoDto
  ) {
    console.log( //sem o transform, o body é um objeto genérico, mesmo tipado como UpdateRecadoDto
      body.constructor.name,
      body instanceof UpdateRecadoDto,
    );
    //lembrete: validation pipe transform está desativado, logo aqui vai dar problema
    var retorno = this.recadosService.update(id, body);
    return retorno;
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number //!ParsePipe direto sem usar o transform do index (forma com mensagem customizada comentada abaixo)
  ) {
    console.log(id, typeof id);
    const recado = this.recadosService.remove(id);
    return { message: `Recado ${id} removido com sucesso`, ...recado };
  }

  @Delete('custom/:id')
  removeCustom(
    @Param('id', new ParseIntPipe({
      exceptionFactory: (error) => {
        return new HttpException(`Id inválido: ${error}`, HttpStatus.BAD_REQUEST);
      }
    })) id: number //!ParsePipe direto sem usar o transform do index
  ) {
    console.log(id, typeof id);
    const recado = this.recadosService.remove(id);
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
