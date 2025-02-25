import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, HttpException } from '@nestjs/common';
import { ExemplosService } from './exemplos.service';
import { IsNumberPipe } from 'src/common/pipes/is-number.pipe';
import { UserParam } from 'src/common/param/user-param.decorator';
import { ReqDataParam } from 'src/common/param/req-data-param.decorator';

@Controller('exemplos')
export class ExemplosController {
  constructor(private readonly exemplosService: ExemplosService) { }

  @Get()
  findAll() {
    return this.exemplosService.findAll();
  }

  @Get(':id')
  @UsePipes(IsNumberPipe)
  findOne(@Param('id') id: number) {
    return this.exemplosService.findOne(id);
  }

  @Get('uuid/:uuid')
  findOneByUuid(@Param('uuid') id: string) {
    return this.exemplosService.findOneUuid(id);
  }

  @Get('fluxo/:uuid')
  fluxo(
    @Param('uuid') uuid: string,
    @UserParam() user: any,
    @ReqDataParam('url') url: string,
  ) {
    console.log('🔄 Controller chamado.');

    if (user) {
      console.log('🔑 Usuário recebido no controller', user);
    }
    console.log('🔗 URL recebida no controller', url);

    var random = Math.floor(Math.random() * 10) + 1;
    if (random <= 1)
      throw new Error(`Erro de 10% ao processar uuid: ${uuid}`);

    if (random <= 3)
      throw new HttpException(`Erro de 20% ao processar uuid: ${uuid}`, 400);

    var retorno = this.exemplosService.findOneUuid(uuid);
    console.log('✳️  Controller concluído.');
    return retorno;
  }
}
