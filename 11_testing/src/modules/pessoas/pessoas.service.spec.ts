import { Repository } from "typeorm";
import { PessoasService } from "./pessoas.service";
import { Pessoa } from "./entities/pessoa.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { IHashingService } from "../auth/hashing/hashing.service";
import { CreatePessoaDto } from "./dto/create-pessoa.dto";
import { ConflictException, HttpException } from "@nestjs/common";
import { skip } from "node:test";
import { UpdatePessoaDto } from "./dto/update-pessoa.dto";

// Início do bloco de testes para o serviço PessoasService
describe("PessoasService", () => {
  let _pessoaService: PessoasService; // Instância do serviço a ser testado
  let _pessoaRepository: Repository<Pessoa>; // Mock do repositório de Pessoa
  let _hashingService: IHashingService; // Mock do serviço de hashing

  // Executa antes de cada teste
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PessoasService, // Serviço sendo testado
        {
          // Mock do repositório TypeORM da entidade Pessoa
          provide: getRepositoryToken(Pessoa),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            remove: jest.fn()
          }
        },
        {
          // Mock do serviço de hashing utilizado pelo PessoasService
          provide: IHashingService,
          useValue: {
            hashPassword: jest.fn(),
            comparePassword: jest.fn(),
          }
        }
      ],
    }).compile();

    // Recupera as instâncias do módulo injetado
    _pessoaService = module.get<PessoasService>(PessoasService);
    _pessoaRepository = module.get<Repository<Pessoa>>(getRepositoryToken(Pessoa));
    _hashingService = module.get<IHashingService>(IHashingService);
  });

  // Verifica se o serviço foi corretamente instanciado
  it("pessoaService should be defined", () => {
    expect(_pessoaService).toBeDefined();
  });

  // Bloco de testes para o método create()
  describe("create", () => {
    it("should create a new 'pessoa'", async () => {
      // Arrange (configura os dados e mocks)
      const createPessoaDto: CreatePessoaDto = {
        email: "testeJest@teste.com",
        nome: "Teste Jest",
        password: "123456"
      };

      const passwordHash = "hashedPassword"; // Valor simulado para a senha hasheada

      // Objeto simulado representando uma nova pessoa
      const novaPessoa = {
        id: 1,
        email: createPessoaDto.email,
        nome: createPessoaDto.nome,
        passwordHash: passwordHash,
      } as Pessoa;

      // Mock do método hashPassword - sempre retorna 'hashedPassword'
      jest.spyOn(_hashingService, "hashPassword").mockResolvedValue(passwordHash); //resolve para metodos assíncronos

      // Mock do método create do repositório - retorna o objeto 'novaPessoa'
      jest.spyOn(_pessoaRepository, "create").mockReturnValue(novaPessoa); //return para metodos sincronos

      // Mock do método findOne do serviço - retorna o mesmo objeto criado
      jest.spyOn(_pessoaService, "findOne").mockResolvedValue(novaPessoa);

      // Act (executa o método que está sendo testado)
      const result = await _pessoaService.create(createPessoaDto);

      // Assert (verifica se os métodos foram chamados corretamente e o retorno está certo)
      expect(_hashingService.hashPassword).toHaveBeenCalledTimes(1);
      expect(_hashingService.hashPassword).toHaveBeenCalledWith(createPessoaDto.password);

      expect(_pessoaRepository.create).toHaveBeenCalledWith({
        email: createPessoaDto.email,
        nome: createPessoaDto.nome,
        passwordHash: passwordHash,
      });

      expect(_pessoaRepository.save).toHaveBeenCalledWith(novaPessoa);
      expect(_pessoaService.findOne).toHaveBeenCalledWith(novaPessoa.id);

      expect(result).toEqual(novaPessoa);
    });

    it("should throw a ConflictException if email already exists", async () => {
      const pessoaAtual = {
        id: 1,
        email: "testeJest@teste.com",
        nome: "Teste Jest",
      } as Pessoa;

      const createPessoaDto2: CreatePessoaDto = {
        email: "testeJest@teste.com",
        nome: "Teste Jest2",
        password: "1234567"
      };

      // Mock do método findByEmail para simular que o e-mail já existe
      jest.spyOn(_pessoaRepository, "findOne").mockResolvedValue(pessoaAtual);

      // Ao colocar uma chamada de metodo async no expect, não se pode colocar await dentro do expect
      // Quando você faz await pessoaService.create(...),
      // o await resolve a Promise antes que o Jest possa aplicar a verificação de erro
      // com rejects.toThrow. Isso significa que, se a exceção for lançada, ela vai ser
      // lançada fora do controle do Jest, e o teste falha de forma inesperada (às vezes
      // como "unhandled exception").
      //! para reject, deve-se usar o await fora do expect
      await expect(_pessoaService.create(createPessoaDto2)).rejects.toThrow(ConflictException);
    });

    it("should throw another error if something goes wrong", async () => {
      jest.spyOn(_pessoaRepository, "findOne").mockRejectedValue(new Error("Erro inesperado"));
      await expect(_pessoaService.create({} as CreatePessoaDto)).rejects.toThrow(new Error("Erro inesperado"));
    });
  });

  describe('findOnde', () => {
    // Arrange (configura os dados e mocks)
    const pessoaId = 1;
    const wrongId = 3;
    const pessoaEncontrada = {
      id: pessoaId,
      email: 'teste@teste.com.br',
      nome: 'Alexandre',
      ativo: true
    } as Pessoa;

    beforeEach(() => {
      // Mock do método findOne do repositorio - retorna o mesmo objeto criado ou vazio (pq usar beforeEach, no comentário no fim do arquivo)
      jest.spyOn(_pessoaRepository, "findOne").mockImplementation(
        async (options: any) => options?.where?.id === 1 ? pessoaEncontrada : null);
    });

    it('should return one Pessoa if a Pessoa is founded ', async () => {
      // Act (executa o método que está sendo testado)
      const result = await _pessoaService.findOne(pessoaId);
      // Assert (verifica se os métodos foram chamados corretamente e o retorno está certo)
      expect(result).toEqual(pessoaEncontrada);
      expect(_pessoaRepository.findOne).toHaveBeenCalledWith({
        select: ['id', 'email', 'nome', 'ativo'],
        where: { id: pessoaId },
      })
    });

    it('should throw an HttpException if no Pessoa is founded', async () => {
      // Act (executa o método que está sendo testado)
      const request = _pessoaService.findOne(wrongId);
      // Assert (verifica se os métodos foram chamados corretamente e o retorno está de acordo)
      await expect(request).rejects.toThrow(new HttpException('Pessoa não encontrada', 404));
    });
  });

  describe('findAll', () => {
    // Arrange
    const pessoas: Pessoa[] = [
      {
        id: 1,
        email: 'teste@teste.com.br',
        nome: 'Alexandre',
        ativo: true
      } as Pessoa,
      {
        id: 2,
        email: 'teste2@teste.com.br',
        nome: 'Bernard',
        ativo: true
      } as Pessoa,
    ];

    beforeEach(() => {
      jest.spyOn(_pessoaRepository, "find").mockImplementation(
        async (options: any) => options?.take === 1 ? [pessoas[0]] : pessoas
      );
    });

    it('should return all Pessoas', async () => {
      const result = await _pessoaService.findAll();
      expect(result.length).toBeGreaterThan(1);
      expect(_pessoaRepository.find).toHaveBeenCalledWith({
        select: ['id', 'email', 'nome', 'ativo']
      })
    });

    it('should return a list of Pessoa paginated with page 1 limit 1', async () => {
      const page = 1;
      const limit = 1;
      const result = await _pessoaService.findAll(page, limit);
      expect(result.length).toEqual(1);
      expect(_pessoaRepository.find).toHaveBeenCalledWith({
        select: ['id', 'email', 'nome', 'ativo'],
        take: 1,
        skip: 0
      })
    });
  });

  describe('update', () => {
    // Arrange (configura os dados e mocks)
    const pessoaId = 1;
    const wrongId = 5;
    let pessoaEncontrada;

    beforeEach(() => {
      pessoaEncontrada = {
        id: pessoaId,
        email: 'teste@teste.com.br',
        nome: 'Alexandre',
        ativo: true
      } as Pessoa;

      // Mock do método findOne do repositorio - retorna o mesmo objeto criado ou vazio (pq usar beforeEach, no comentário no fim do arquivo)
      jest.spyOn(_pessoaRepository, "findOne").mockImplementation(
        async (options: any) => options?.where?.id === 1 ? pessoaEncontrada : null);

      jest.spyOn(_pessoaRepository, "update").mockImplementation(
        async (id: number, partialDto: any) => {
          //console.log(partialDto);
          pessoaEncontrada.nome = partialDto.nome ?? pessoaEncontrada.nome;
          pessoaEncontrada.email = partialDto.email ?? pessoaEncontrada.email;
          pessoaEncontrada.ativo = partialDto.ativo !== undefined ? partialDto.ativo : pessoaEncontrada.ativo;
          return null;
        });
    });

    it('should return the Pessoa upon update the data', async () => {
      const dadosPraAtualizar = {
        email: 'atualizado@teste.com.br', //mandando só pra garantir que não será atualizado (pois é o service que vai omitir essa informação)
        nome: 'Bernard',
        password: "nova senha",
        ativo: false
      }; // as UpdatePessoaDto; //deixado comentado pra testar o email, pois com tipagem não deixa usar o email

      const pessoaAtualizada = await _pessoaService.update(pessoaId, dadosPraAtualizar);
      expect(pessoaAtualizada.email).not.toEqual(dadosPraAtualizar.email); //email não pode ser atualizado
      expect(pessoaAtualizada.nome).toEqual(dadosPraAtualizar.nome);
      expect(pessoaAtualizada.ativo).toEqual(dadosPraAtualizar.ativo);
      expect(_pessoaRepository.findOne).toHaveBeenCalledTimes(2);
      expect(_hashingService.hashPassword).toHaveBeenCalledTimes(1);
      expect(_hashingService.hashPassword).toHaveBeenCalledWith(dadosPraAtualizar.password);

      const updateMock = _pessoaRepository.update as jest.Mock; //pra garantir que não será adicionado no serviço a inclusão de email no update
      const calledWith = updateMock.mock.calls[0][1]; // segundo argumento da chamada
      expect(calledWith).not.toHaveProperty('email');
    });

    it('should throw an exception if try to update a non existing Pessoa', async () => {
      const request = _pessoaService.update(wrongId, {} as any);
      await expect(request).rejects.toThrow(HttpException);
    });
  });

  describe('remove', () => {
    // Arrange (configura os dados e mocks)
    const pessoaId = 1;
    let pessoaEncontrada;

    beforeEach(() => {
      pessoaEncontrada = {
        id: pessoaId,
        email: 'teste@teste.com.br',
        nome: 'Alexandre',
        ativo: true
      } as Pessoa;

      // Mock do método findOne do repositorio - retorna o mesmo objeto criado ou vazio (pq usar beforeEach, no comentário no fim do arquivo)
      jest.spyOn(_pessoaRepository, "findOne").mockImplementation(
        async (options: any) => options?.where?.id === 1 ? pessoaEncontrada : null
      );

      jest.spyOn(_pessoaRepository, "remove").mockImplementation(
        async (pessoa: Pessoa) => {
          const deletedPerson = { ...pessoa };
          pessoaEncontrada = undefined;
          return deletedPerson;
        }
      );
    });

    it('should delete the Person', async () => {
      const deletedPerson = await _pessoaService.remove(1);

      expect(deletedPerson).toBeDefined();
      expect(_pessoaRepository.remove).toHaveBeenCalledTimes(1);
      await expect(_pessoaService.remove(1)).rejects.toThrow(new HttpException('Pessoa não encontrada', 404));
    });
  });
});

/*
pq usar beforeEach
Quando você usa beforeAll(), o Jest executa esse bloco antes de qualquer it() rodar,
mas depois que os objetos da classe (como _pessoaService) já foram instanciados (no escopo
do arquivo ou do describe). Se o seu serviço ou repositório for instanciado antes do spyOn,
o spyOn não intercepta o método real, porque o método já foi clonado ou capturado antes.

Em outras palavras:
Se você fizer spyOn depois da instância ser criada (e já tiver clonado o método), o mock não funciona.

Com beforeEach, o spyOn é recriado antes de cada teste, e por isso funciona corretamente
com instâncias já criadas.

Evite beforeAll com spyOn se já instanciou o objeto antes do describe
Se você fizer algo como:
const _pessoaRepository = new PessoaRepository();
const _pessoaService = new PessoaService(_pessoaRepository);

Então usar beforeAll não vai funcionar para mocks de métodos, porque eles já foram definidos
antes do spyOn.
*/
