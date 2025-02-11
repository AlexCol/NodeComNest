import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Recado } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RecadosService {
  constructor(
    @InjectRepository(Recado) private readonly recadoRepository: Repository<Recado>
  ) { }

  async findAll(page: number, limit: number = 0) {
    const take = limit;
    const skip = (page - 1) * limit;

    if (limit === 0)
      return await this.recadoRepository.find();

    return await this.recadoRepository.find({ take, skip });
  }

  async findById(id: number) {
    const recado = await this.recadoRepository.findOne({ where: { id } });
    if (!recado) {
      this.throwNotFoundException();
    }
    return recado;
  }

  async create(recadoDto: CreateRecadoDto) {
    const novoRecado = {
      ...recadoDto,
      lido: false,
      criadoEm: new Date(),
    }

    const recado = this.recadoRepository.create(novoRecado);
    return await this.recadoRepository.save(recado);
  }

  async update(id: number, recado: UpdateRecadoDto) {
    return null;
  }

  async remove(id: number) {
    const recado = await this.findById(id);
    await this.recadoRepository.remove(recado);
    return recado;
  }

  private throwNotFoundException() {
    //throw new NotFoundException('Recado não encontrado');
    throw new HttpException('Recado não encontrado', HttpStatus.NOT_FOUND);
  }
}
