import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Recado } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';

@Injectable()
export class RecadosService {
  private lastId = 1;
  private recados = [
    {
      id: this.lastId++,
      texto: 'Recado 1',
      de: 'Joana',
      para: 'João',
      lido: true,
      criadoEm: new Date(),
    },
    {
      id: this.lastId++,
      texto: 'Recado 2',
      de: 'João',
      para: 'Joana',
      lido: false,
      criadoEm: new Date(),
    },
  ];

  findAll(page: number, limit: number) {
    if (page && limit) {
      return this.findPaginated(page, limit);
    }
    return this.recados;
  }

  private findPaginated(page: number, limit: number) {
    const start = (page - 1) * limit;
    const end = start + limit;
    return this.recados.slice(start, end);
  }

  findById(id: number) {
    var index = this.findIndexById(id);
    return this.recados[index];
  }

  create(recado: CreateRecadoDto) {
    var newRecado: Recado = {
      id: this.lastId++,
      ...recado,
      lido: false,
      criadoEm: new Date()
    };
    this.recados.push(newRecado);
    return newRecado;
  }

  update(id: number, recado: UpdateRecadoDto) {
    const index = this.findIndexById(id);

    //! com a validation pipeline, isso não é mais necessário
    //const { id: _, ...recadoDto } = recado as any;

    this.recados[index] = { ...this.recados[index], ...recado };
    return this.recados[index];
  }

  remove(id: number) {
    const index = this.findIndexById(id);
    const recado = this.recados[index];
    this.recados.splice(index, 1);
    return recado;
  }

  private findIndexById(id: number) {
    const index = this.recados.findIndex((recado) => recado.id === id);
    if (index === -1) {
      this.throwNotFoundException();
    }
    return index;
  }

  private throwNotFoundException() {
    throw new NotFoundException('Recado não encontrado');
    //throw new HttpException('Recado não encontrado', HttpStatus.NOT_FOUND);
  }
}
