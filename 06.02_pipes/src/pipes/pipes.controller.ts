import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes } from '@nestjs/common';
import { PipesService } from './pipes.service';
import { CreatePipeDto } from './dto/create-pipe.dto';
import { UpdatePipeDto } from './dto/update-pipe.dto';
import { IsNumberPipe } from 'src/common/pipes/is-number.pipe';

@Controller('pipes')
export class PipesController {
  constructor(private readonly pipesService: PipesService) { }

  @Get()
  findAll() {
    return this.pipesService.findAll();
  }

  @Get('id/:id')
  @UsePipes(IsNumberPipe)
  findOne(@Param('id') id: number) {
    console.log("Type of id: ", typeof id);
    return this.pipesService.findOne(+id);
  }

  @Get('uuid/:uuid')
  findOneByUuid(@Param('uuid') uuid: string) {
    console.log("Type of uuid: ", typeof uuid);
    return this.pipesService.findOneByUuid(uuid);
  }
}
