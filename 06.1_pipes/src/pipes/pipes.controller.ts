import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PipesService } from './pipes.service';
import { CreatePipeDto } from './dto/create-pipe.dto';
import { UpdatePipeDto } from './dto/update-pipe.dto';

@Controller('pipes')
export class PipesController {
  constructor(private readonly pipesService: PipesService) { }

  @Get()
  findAll() {
    return this.pipesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    console.log("Type of id: ", typeof id);
    return this.pipesService.findOne(id);
  }
}
