import { Repository } from "typeorm";
import { PessoasService } from "./pessoas.service";
import { Pessoa } from "./entities/pessoa.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { IHashingService } from "../auth/hashing/hashing.service";
import { CreatePessoaDto } from "./dto/create-pessoa.dto";
import { ConflictException } from "@nestjs/common";

// Início do bloco de testes para o serviço PessoasService
describe("PessoasService", () => {
  let pessoaService: PessoasService; // Instância do serviço a ser testado
  let pessoaRepository: Repository<Pessoa>; // Mock do repositório de Pessoa
  let hashingService: IHashingService; // Mock do serviço de hashing

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
            delete: jest.fn(),
            update: jest.fn(),
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
    pessoaService = module.get<PessoasService>(PessoasService);
    pessoaRepository = module.get<Repository<Pessoa>>(getRepositoryToken(Pessoa));
    hashingService = module.get<IHashingService>(IHashingService);
  });

  // Verifica se o serviço foi corretamente instanciado
  it("pessoaService should be defined", () => {
    expect(pessoaService).toBeDefined();
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
      jest.spyOn(hashingService, "hashPassword").mockResolvedValue(passwordHash); //resolve para metodos assíncronos

      // Mock do método create do repositório - retorna o objeto 'novaPessoa'
      jest.spyOn(pessoaRepository, "create").mockReturnValue(novaPessoa); //return para metodos sincronos

      // Mock do método findOne do serviço - retorna o mesmo objeto criado
      jest.spyOn(pessoaService, "findOne").mockResolvedValue(novaPessoa);

      // Act (executa o método que está sendo testado)
      const result = await pessoaService.create(createPessoaDto);

      // Assert (verifica se os métodos foram chamados corretamente e o retorno está certo)
      expect(hashingService.hashPassword).toHaveBeenCalledTimes(1);
      expect(hashingService.hashPassword).toHaveBeenCalledWith(createPessoaDto.password);

      expect(pessoaRepository.create).toHaveBeenCalledWith({
        email: createPessoaDto.email,
        nome: createPessoaDto.nome,
        passwordHash: passwordHash,
      });

      expect(pessoaRepository.save).toHaveBeenCalledWith(novaPessoa);
      expect(pessoaService.findOne).toHaveBeenCalledWith(novaPessoa.id);

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
      jest.spyOn(pessoaRepository, "findOne").mockResolvedValue(pessoaAtual);

      // Ao colocar uma chamada de metodo async no expect, não se pode colocar await dentro do expect
      // Quando você faz await pessoaService.create(...),
      // o await resolve a Promise antes que o Jest possa aplicar a verificação de erro
      // com rejects.toThrow. Isso significa que, se a exceção for lançada, ela vai ser
      // lançada fora do controle do Jest, e o teste falha de forma inesperada (às vezes
      // como "unhandled exception").
      //! para reject, deve-se usar o await fora do expect
      await expect(pessoaService.create(createPessoaDto2)).rejects.toThrow(ConflictException);
    });

    it("should throw another error if something goes wrong", async () => {
      jest.spyOn(pessoaRepository, "findOne").mockRejectedValue(new Error("Erro inesperado"));
      await expect(pessoaService.create({} as CreatePessoaDto)).rejects.toThrow(new Error("Erro inesperado"));
    });
  });
});
