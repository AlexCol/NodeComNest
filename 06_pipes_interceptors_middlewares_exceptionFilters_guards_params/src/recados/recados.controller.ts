import {
  BadRequestException,
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
  Req,
  Request,
  UseGuards,
  UseInterceptors,
  UsePipes
} from '@nestjs/common';
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ParseIntIdPipe } from 'src/common/pipes/parse-int-id';
import { AddHeaderInterceptor } from 'src/common/interceptors/add-header.interceptor';
import { FastifyRequest } from 'fastify';
import { IsAdminGuard } from 'src/common/guards/is-admin.guard';
import { IsPublic } from 'src/common/guards/is-public';
import { UrlParam } from 'src/common/params/url-param.decorator';
import { ReqDataParam } from 'src/common/params/req-data.param.decorator';

@Controller('recados')
// @UsePipes(new ParseIntPipe( //exemplo de uso de pipe em um controller (pode ter options ou não), pode quebrar rotas que não tenham parametros numericos (como findAll)
//   {
//     exceptionFactory() {
//       throw new HttpException('Controller - Erro ao converter o parâmetro numerico', HttpStatus.BAD_REQUEST);
//     },
//   },
// ))
//@UsePipes(ParseIntIdPipe) //exemplo de uso de customPipe em um controller (por focar em 'id', essa não teria problema em colocar no controller)
//sobre pipes: //pode ser usado no controller, metodo ou global, adicionei no index - cuidar pois se colocar global e aqui ele vai chamar 2x
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) { }
  @Get()
  //@UseGuards(new IsAdminGuard('admin')) //exemplo de uso de guarda em um controller
  @IsPublic()
  async findAll(
    @Query() paginationDto: PaginationDto,
    //@UrlParam() url: string
    @ReqDataParam('url') url: string,
    @ReqDataParam('method') method: string
  ) {
    console.log('Url:', url);
    console.log('Method:', method);
    return await this.recadosService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(
    //@Param('id', ParseIntPipe) id: number //exemplo passando ParseIntPipe sem options
    //@Param('id', ParseIntIdPipe) id: number //exemplo usando customPipe - por focar em 'id', essa não teria problema em colocar no controller
    @Param('id') id: number //Pipes podem ser usados no metodo (ou global, adicionei no index - cuidar pois se colocar global e aqui ele vai chamar 2x)
    , @Request() req: FastifyRequest
  ) {
    console.log('User:', req['user']); //!funciona para o Express, para o fastify não, pois mesmo que adicione no middleare, a request é imutavel no fastify
    return await this.recadosService.findById(id);
  }

  @Post()
  async create(@Body() body: CreateRecadoDto) {
    return await this.recadosService.create(body);
  }

  @Put(':id')
  async updatePut(
    @Param('id', new ParseIntPipe({ //exemplo passando ParseIntPipe com options -- ele é sobrescrito se tenho o pipe no controller
      exceptionFactory() {
        //essa bosta não funciona com o fastify, ela gera uma response do Express no Filter
        throw new BadRequestException('Metodo - Erro ao converter o parâmetro id');
      },
    })) id: number,
    @Body() body: UpdateRecadoDto
  ) {
    return await this.recadosService.update(id, body);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateRecadoDto
  ) {
    var retorno = await this.recadosService.update(id, body);
    return retorno;
  }

  @Delete(':id')
  async remove(
    @Param('id') id: number //vai validar pelo controller (pipe)
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
