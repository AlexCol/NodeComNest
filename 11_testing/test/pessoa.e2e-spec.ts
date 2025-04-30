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
  let id1: number;
  const email1 = 'meuEmail@teste.com.br';
  const password1 = '123Aab@';
  const nome1 = 'Alexandre';

  let id2: number;
  const email2 = 'meuJest@teste.com.br';
  const password2 = '123Aab@';
  const nome2 = 'Bernard';

  let app: INestApplication<App>;
  let accessToken: string;
  let refreshToken: string;

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
      createDto.email = email1;
      createDto.nome = nome1;
      createDto.password = password1;
    });

    it('should succesufly create a Pessoa', async () => {
      const result = await request(app.getHttpServer())
        .post('/pessoas')
        .send(createDto)
        .expect(HttpStatus.CREATED);

      expect(result.body).toEqual({
        id: expect.any(Number),
        email: email1,
        nome: nome1,
        ativo: true
      });

      id1 = +result.body.id;
    });

    it('should succesufly create a second Pessoa', async () => {
      const createDto2 = new CreatePessoaDto();
      createDto2.email = email2;
      createDto2.nome = nome2;
      createDto2.password = password2;

      const result = await request(app.getHttpServer())
        .post('/pessoas')
        .send(createDto2)
        .expect(HttpStatus.CREATED);

      expect(result.body).toEqual({
        id: expect.any(Number),
        email: email2,
        nome: nome2,
        ativo: true
      });

      id2 = +result.body.id;
    });

    it('should fail when try to create user with same email', async () => {
      const dto2 = createDto;
      dto2.nome = 'Outro Nome';
      await request(app.getHttpServer())
        .post('/pessoas')
        .send(dto2)
        .expect(HttpStatus.CONFLICT);
    });
  });

  describe('auth/login (POST)', () => {
    it('should be able to login after be created', async () => {
      const result = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: email1, password: password1 })
        .expect(HttpStatus.OK);

      accessToken = result.body.accessToken;
      refreshToken = result.body.refreshToken;
    });
  });

  describe('/pessoa/:id (GET)', () => {
    it('should return 401 on request a Pessoa without token', async () => {
      await request(app.getHttpServer())
        .get(`/pessoas/${id1}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should be able to search for a Person when logged in', async () => {
      const result = await request(app.getHttpServer())
        .get(`/pessoas/${id2}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);

      expect(result.body).toEqual({
        id: id2,
        email: email2,
        nome: nome2,
        ativo: true
      })
    });

    it('should return 404 if searched Pessoa not exists', async () => {
      const id = 100;
      await request(app.getHttpServer())
        .get(`/pessoas/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

});

//! testes devem ser feitos para cada erro que se possa pensar que possa gerar, não os criei pra não poluir e ficar de exemplo
//! mas é bom ter testes para validar, por exemplo, email certo, senha valida, nome dentro dos limites, etc, forçando o erro e esperando por eles
//! assim, se algúem mexer no código de forma indevida, será alertado
