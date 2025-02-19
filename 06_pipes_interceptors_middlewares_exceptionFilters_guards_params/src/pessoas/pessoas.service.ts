import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { QueryFailedError, Repository } from 'typeorm';

@Injectable()
export class PessoasService {
  constructor(
    @InjectRepository(Pessoa) private pessoaRepository: Repository<Pessoa>
  ) { }

  async create(createPessoaDto: CreatePessoaDto) {
    try {
      const existePessoa = await this.findByEmail(createPessoaDto.email);
      if (existePessoa) { //alternativa ao catch abaixo
        throw new ConflictException('Endereço de e-mail informado já cadastrado - finded');
      }

      const pessoaData = {
        email: createPessoaDto.email,
        nome: createPessoaDto.nome,
        passwordHash: createPessoaDto.password,
      }

      const novaPessoa = this.pessoaRepository.create(pessoaData);
      await this.pessoaRepository.save(novaPessoa);
      return this.findOne(novaPessoa.id);
    } catch (error) {
      /* deixado aqui pois é a forma apresentada no curso, mas prefiro tratar com uma busca antes de tentar gravar
      ! cuidado: dessa forma, foi feita a tentativa de gravar no banco, de modo que o ID vai ser incrementado
      if (error.code === '23505') {
        throw new ConflictException('Endereço de e-mail informado já cadastrado - catch');
      }
      */
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
    //console.log('service - findOne chamado');
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
    const partialDto = { nome: updatePessoaDto.nome, passwordHash: updatePessoaDto.password }
    await this.pessoaRepository.update(id, partialDto);
    return await this.findOne(id);
  }

  async remove(id: number) {
    const pessoa = await this.findOne(id);
    return await this.pessoaRepository.remove(pessoa);
  }
}
