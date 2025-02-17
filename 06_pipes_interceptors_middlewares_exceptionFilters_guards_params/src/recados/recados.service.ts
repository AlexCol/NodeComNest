import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Recado } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { FindManyOptions, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PessoasService } from 'src/pessoas/pessoas.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class RecadosService {
  constructor(
    @InjectRepository(Recado)
    private readonly recadoRepository: Repository<Recado>,
    private readonly pessoasService: PessoasService
  ) { }

  findBaseOptions: FindManyOptions<Recado> = {
    //relations: ['de', 'para'],
    order: { id: 'desc' },
    select: {
      //id: true,
      //texto: true,
      de: { id: true, nome: true },
      para: { id: true, nome: true },
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit = 0 } = paginationDto;
    const take = limit;
    const skip = (page - 1) * limit;

    if (limit === 0)
      return await this.recadoRepository.find({ ...this.findBaseOptions });

    return await this.recadoRepository.find({ ...this.findBaseOptions, take, skip });
  }

  async findById(id: number) {
    const recado = await this.recadoRepository.findOne({ ...this.findBaseOptions, where: { id } });
    if (!recado) {
      this.throwNotFoundException();
    }
    return recado;
  }

  async create(recadoDto: CreateRecadoDto) {
    const de = await this.pessoasService.findOne(recadoDto.deId);
    const para = await this.pessoasService.findOne(recadoDto.paraId);

    const novoRecado = {
      texto: recadoDto.texto,
      de: de,
      para: para,
      lido: false,
      criadoEm: new Date(),
    }
    const recado = this.recadoRepository.create(novoRecado);
    return await this.recadoRepository.save(recado);
  }

  async update(id: number, recadoDto: UpdateRecadoDto) {
    await this.findById(id);
    const partialDto = { lido: recadoDto?.lido, texto: recadoDto?.texto }
    await this.recadoRepository.update(id, partialDto);
    return await this.findById(id);

    // const partialDto = { lido: recadoDto?.lido, texto: recadoDto?.texto }
    // const recado = await this.recadoRepository.preload({ id: id, ...partialDto })
    // if (!recado) this.throwNotFoundException();
    // return await this.recadoRepository.save(recado);
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
