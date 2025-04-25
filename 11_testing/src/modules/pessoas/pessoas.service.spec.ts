import { Repository } from "typeorm";
import { PessoasService } from "./pessoas.service";
import { Pessoa } from "./entities/pessoa.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { IHashingService } from "../auth/hashing/hashing.service";

describe("PessoasService", () => {
  let pessoaService: PessoasService;
  let pessoaRepository: Repository<Pessoa>;
  let hashingService: IHashingService;

  //beforeAll
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PessoasService,
        {
          provide: getRepositoryToken(Pessoa),
          useValue: {}
        },
        {
          provide: IHashingService,
          useValue: {}
        }
      ],
    }).compile();

    pessoaService = module.get<PessoasService>(PessoasService);
    pessoaRepository = module.get<Repository<Pessoa>>(getRepositoryToken(Pessoa));
    hashingService = module.get<IHashingService>(IHashingService);
  });

  it("pessoaService should be defined", () => {
    expect(pessoaService).toBeDefined();
  });

  describe("create", () => {
    it("should create a new 'pessoa'", async () => {

    });
  });
});
