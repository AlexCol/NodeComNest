import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from 'src/modules/app.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigTypeOrm } from 'src/database/ConfigTypeOrm';
import { RecadosModule } from 'src/modules/recados/recados.module';
import { PessoasModule } from 'src/modules/pessoas/pessoas.module';
import { ColorsModule } from 'src/modules/colors/colors.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { CreatePessoaDto } from 'src/modules/pessoas/dto/create-pessoa.dto';

describe('PessoaController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        //AppModule, //! não usar isso, ou ele vai usar as configurações e jogar no banco do .env
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'root',
          password: 'nest@852ad',
          database: 'testing', //! não usando a database
          autoLoadEntities: true,
          synchronize: true,
          dropSchema: true
        }),
        RecadosModule,
        PessoasModule,
        ColorsModule,
        AuthModule, //por ser global, não precisa ser importado em nenhum outro módulo
      ],
    }).compile();

    app = module.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({
      whitelist: true, //elimina do json de entrada valores que não estão no DTO
      forbidNonWhitelisted: true, //emite erro se houver valores não permitidos
      transform: true, //como 'true' tenta transformar os tipos das variáveis de entrada para os tipos definidos no DTO
    }));

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/pessoas (POST)', () => {
    let createDto: CreatePessoaDto;
    beforeEach(() => {
      createDto = new CreatePessoaDto();
      createDto.email = 'meuEmail@teste.com.br';
      createDto.nome = 'Alexandre';
      createDto.password = '123Aab@';
    });

    it('should succesufly create a Pessoa', async () => {
      const result = await request(app.getHttpServer())
        .post('/pessoas')
        .send(createDto)
        .expect(HttpStatus.CREATED);

      expect(result.body).toEqual({
        id: expect.any(Number),
        email: 'meuEmail@teste.com.br',
        nome: 'Alexandre',
        ativo: true
      });
    });

    it('should fail when try to create user with same email', async () => {
      const dto2 = createDto;
      dto2.nome = 'Outro Nome';
      await request(app.getHttpServer())
        .post('/pessoas')
        .send(dto2)
        .expect(HttpStatus.CONFLICT);
    });

    //! testes devem ser feitos para cada erro que se possa pensar que possa gerar, não os criei pra não poluir e ficar de exemplo
    //! mas é bom ter testes para validar, por exemplo, email certo, senha valida, nome dentro dos limites, etc, forçando o erro e esperando por eles
    //! assim, se algúem mexer no código de forma indevida, será alertado
  });
});
