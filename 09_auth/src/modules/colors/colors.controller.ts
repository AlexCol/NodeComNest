import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ColorsService } from './colors.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';

@Controller('colors')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) { }

  @Post()
  async create(@Body() createColorDto: CreateColorDto) {
    return await this.colorsService.create(createColorDto);
  }

  @Get()
  async findAll() {
    return this.colorsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.colorsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateColorDto: UpdateColorDto) {
    return await this.colorsService.update(id, updateColorDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.colorsService.remove(id);
  }
}
