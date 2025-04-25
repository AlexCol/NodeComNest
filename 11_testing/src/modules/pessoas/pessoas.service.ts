import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { IHashingService } from 'src/modules/auth/hashing/hashing.service';

@Injectable()
export class PessoasService {
  constructor(
    @InjectRepository(Pessoa)
    private pessoaRepository: Repository<Pessoa>, // Repositório da entidade Pessoa (injeção via TypeORM)
    private readonly hashService: IHashingService, // Serviço de hashing para senhas
  ) { }

  /**
   * Cria uma nova pessoa.
   * - Verifica se já existe uma pessoa com o mesmo e-mail.
   * - Hasheia a senha fornecida.
   * - Cria e salva a nova pessoa no banco de dados.
   * - Retorna a pessoa recém-criada.
   */
  async create(createPessoaDto: CreatePessoaDto) {
    try {
      // Verifica se já existe pessoa com o mesmo e-mail
      const existePessoa = await this.findByEmail(createPessoaDto.email);
      if (existePessoa) {
        throw new ConflictException('Endereço de e-mail informado já cadastrado - finded');
      }

      // Gera o hash da senha
      const passwordHash = await this.hashService.hashPassword(createPessoaDto.password);

      // Monta os dados da nova pessoa
      const pessoaData = {
        email: createPessoaDto.email,
        nome: createPessoaDto.nome,
        passwordHash: passwordHash,
      };

      // Cria a entidade e salva no banco
      const novaPessoa = this.pessoaRepository.create(pessoaData);
      await this.pessoaRepository.save(novaPessoa);

      // Retorna a pessoa criada com dados atualizados
      return this.findOne(novaPessoa.id);
    } catch (error) {
      throw error; // Propaga o erro para ser tratado por camadas superiores
    }
  }

  /**
   * Busca uma pessoa pelo e-mail.
   * Método privado usado internamente.
   */
  private async findByEmail(email: string) {
    return await this.pessoaRepository.findOne({ where: { email } });
  }

  /**
   * Retorna todas as pessoas cadastradas.
   * - Suporta paginação com `page` e `limit`.
   * - Se `limit` for zero, retorna todos os registros.
   */
  async findAll(page: number, limit: number = 0) {
    if (limit < 1) {
      return await this.pessoaRepository.find({
        select: ['id', 'email', 'nome', 'ativo'],
      });
    }

    return await this.pessoaRepository.find({
      select: ['id', 'email', 'nome', 'ativo'],
      take: limit, // Quantidade de registros por página
      skip: (page - 1) * limit, // Pula os registros das páginas anteriores
    });
  }

  /**
   * Busca uma pessoa pelo ID.
   * - Lança exceção 404 se não for encontrada.
   */
  async findOne(id: number) {
    const pessoa = await this.pessoaRepository.findOne({
      select: ['id', 'email', 'nome', 'ativo'],
      where: { id },
    });

    if (!pessoa) {
      throw new HttpException('Pessoa não encontrada', 404);
    }

    return pessoa;
  }

  /**
   * Atualiza os dados de uma pessoa.
   * - Valida se a pessoa existe antes de atualizar.
   * - Se a senha for fornecida, é hasheada.
   */
  async update(id: number, updatePessoaDto: UpdatePessoaDto) {
    await this.findOne(id); // Valida se a pessoa existe (lança 404 se não)

    // Hasheia a nova senha, se informada
    let passwordHash = updatePessoaDto.password;
    if (passwordHash)
      passwordHash = await this.hashService.hashPassword(updatePessoaDto.password);

    // Monta o objeto parcial com os dados a atualizar
    const partialDto = {
      nome: updatePessoaDto.nome,
      passwordHash,
      ativo: updatePessoaDto.ativo,
    };

    await this.pessoaRepository.update(id, partialDto);

    return await this.findOne(id); // Retorna a pessoa atualizada
  }

  /**
   * Remove uma pessoa do banco de dados.
   * - Primeiro busca a pessoa pelo ID.
   * - Depois remove.
   */
  async remove(id: number) {
    const pessoa = await this.findOne(id); // Lança exceção se não existir
    return await this.pessoaRepository.remove(pessoa);
  }
}
