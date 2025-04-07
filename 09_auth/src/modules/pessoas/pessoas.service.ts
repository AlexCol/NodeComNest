import { BadRequestException, ConflictException, HttpException, Injectable } from '@nestjs/common';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { IHashingService } from 'src/auth/hashing/hashing.service';

@Injectable()
export class PessoasService {
  constructor(
    @InjectRepository(Pessoa)
    private pessoaRepository: Repository<Pessoa>,
    private readonly hashService: IHashingService,
  ) { }

  async create(createPessoaDto: CreatePessoaDto) {
    try {
      const existePessoa = await this.findByEmail(createPessoaDto.email);
      if (existePessoa) {
        throw new ConflictException('Endereço de e-mail informado já cadastrado - finded');
      }

      const passwordHash = await this.hashService.hashPassword(createPessoaDto.password);

      const pessoaData = {
        email: createPessoaDto.email,
        nome: createPessoaDto.nome,
        passwordHash: passwordHash,
      }

      const novaPessoa = this.pessoaRepository.create(pessoaData);
      await this.pessoaRepository.save(novaPessoa);
      return this.findOne(novaPessoa.id);
    } catch (error) {
      throw error;
    }
  }

  private async findByEmail(email: string) {
    return await this.pessoaRepository.findOne({ where: { email } });
  }

  async findAll(page: number, limit: number = 0) {
    if (limit < 1) {
      return await this.pessoaRepository.find({
        select: ['id', 'email', 'nome']
      });
    }
    return await this.pessoaRepository.find({
      select: ['id', 'email', 'nome'],
      take: limit,
      skip: (page - 1) * limit
    });

  }

  async findOne(id: number) {
    const pessoa = await this.pessoaRepository.findOne({
      select: ['id', 'email', 'nome'],
      where: { id }
    });
    if (!pessoa) {
      throw new HttpException('Pessoa não encontrada', 404);
    }
    return pessoa;
  }

  async update(id: number, updatePessoaDto: UpdatePessoaDto) {
    await this.findOne(id); //só pra validar se a pessoa existe

    let passwordHash = updatePessoaDto.password;
    if (passwordHash)
      passwordHash = await this.hashService.hashPassword(updatePessoaDto.password);

    const partialDto = { nome: updatePessoaDto.nome, passwordHash };
    await this.pessoaRepository.update(id, partialDto);
    return await this.findOne(id);
  }

  async remove(id: number) {
    const pessoa = await this.findOne(id);
    return await this.pessoaRepository.remove(pessoa);
  }
}
