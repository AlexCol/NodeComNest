import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Recado } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { FindManyOptions, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PessoasService } from '../pessoas/pessoas.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class RecadosService {
  constructor(
    @InjectRepository(Recado) private readonly recadoRepository: Repository<Recado>,
    private readonly pessoasService: PessoasService,
    private readonly emailService: EmailService
  ) { }

  findBaseOptions: FindManyOptions<Recado> = {
    relations: ['de', 'para'], //! para trazer os dados relacionados
    order: { id: 'desc' },
    select: {
      id: true,
      texto: true,
      lido: true,
      de: { id: true, nome: true },
      para: { id: true, nome: true },
    }
  }

  async findAll(userId: number, page: number, limit: number = 0) {
    const take = limit;
    const skip = (page - 1) * limit;

    const para = { id: userId };

    if (limit === 0)
      return await this.recadoRepository.find({ ...this.findBaseOptions, where: { para } });

    const recado = await this.recadoRepository.find({ ...this.findBaseOptions, take, skip, where: { para } });
    console.log('recado', recado);
    return recado;
  }

  async findById(userId: number, id: number) {
    const recado = await this.recadoRepository.findOne({ ...this.findBaseOptions, where: { id } });
    if (!recado) {
      this.throwNotFoundException();
    } else if (recado.de.id !== userId && recado.para.id !== userId) {
      console.log(recado);
      throw new HttpException('Recado não pertence a você', HttpStatus.FORBIDDEN);
    }

    return recado;
  }

  async create(deId: number, recadoDto: CreateRecadoDto) {
    const de = await this.pessoasService.findOne(deId);
    const para = await this.pessoasService.findOne(recadoDto.paraId);

    this.emailService.sendEmail(
      para.email,
      `Você recebeu um recado de ${de.nome}`,
      "Para visualizar seu recado, acesse o site xxxx"
    );

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

  async update(userId: number, id: number, recadoDto: UpdateRecadoDto) {
    const recado = await this.findById(userId, id);
    if (recado.de.id !== userId && recadoDto?.texto && recado.texto !== recadoDto?.texto)
      throw new HttpException('Só pode editar a mensagem de recados que você enviou.', HttpStatus.FORBIDDEN);

    const propLido = recadoDto?.lido !== null && recadoDto?.lido !== undefined;
    if (recado.para.id !== userId && propLido && recado.lido !== recadoDto?.lido)
      throw new HttpException('Só pode marcado como lido recados que você recebeu.', HttpStatus.FORBIDDEN);

    const partialDto = { lido: recadoDto?.lido, texto: recadoDto?.texto }
    await this.recadoRepository.update(id, partialDto);
    return await this.findById(userId, id);

    // const partialDto = { lido: recadoDto?.lido, texto: recadoDto?.texto }
    // const recado = await this.recadoRepository.preload({ id: id, ...partialDto })
    // if (!recado) this.throwNotFoundException();
    // return await this.recadoRepository.save(recado);
  }

  async remove(userId: number, id: number) {
    const recado = await this.findById(userId, id);
    if (recado.de.id !== userId)
      throw new HttpException('Só pode deletar recados que você enviou.', HttpStatus.FORBIDDEN);

    await this.recadoRepository.remove(recado);
    return recado;
  }

  private throwNotFoundException() {
    //throw new NotFoundException('Recado não encontrado');
    throw new HttpException('Recado não encontrado', HttpStatus.NOT_FOUND);
  }
}
