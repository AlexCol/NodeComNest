import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Color } from './entities/color.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ColorsService {
  constructor(
    @InjectRepository(Color) private colorRepository: Repository<Color>
  ) { }

  async create(createColorDto: CreateColorDto) {
    const existeCor = await this.colorRepository.findOne({
      where: { colorName: createColorDto.colorName },
    });
    console.log(existeCor);
    if (existeCor)
      throw new BadRequestException('Cor já cadastrada');

    const colorData = {
      colorName: createColorDto.colorName,
      colorHex: createColorDto.colorHex,
      colorRgb: createColorDto.colorRgb,
    };

    const newColor = await this.colorRepository.create(colorData);
    return this.colorRepository.save(newColor);
  }

  async findAll() {
    return await this.colorRepository.find({
      select: ['id', 'colorName', 'colorHex', 'colorRgb'],
    });
  }

  findOne(id: number) {
    return this.colorRepository.findOne({
      select: ['id', 'colorName', 'colorHex', 'colorRgb'],
      where: { id },
    });
  }

  async update(id: number, updateColorDto: UpdateColorDto) {
    const color = await this.colorRepository.findOne({ where: { id } });
    if (!color) throw new BadRequestException('Cor não encontrada');

    await this.colorRepository.update(id, updateColorDto);
    return await this.colorRepository.findOne({
      select: ['id', 'colorName', 'colorHex', 'colorRgb'],
      where: { id },
    });
  }

  async remove(id: number) {
    const color = await this.colorRepository.findOne({ where: { id } });
    if (!color) throw new BadRequestException('Cor não encontrada');

    await this.colorRepository.delete(id);
  }
}
