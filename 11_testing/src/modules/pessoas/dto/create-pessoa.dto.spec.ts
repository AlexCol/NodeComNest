import { validate } from "class-validator";
import { CreatePessoaDto } from "./create-pessoa.dto";

describe('CreatePessoaDto', () => {
  let dto: CreatePessoaDto;
  beforeEach(() => {
    dto = new CreatePessoaDto();
    dto.email = 'meuEmail@teste.com.br';
    dto.nome = 'Alexandre';
    dto.password = '123Aab@';
  });

  it('should have 0 errors on valid DTO', async () => {
    const errors = await validate(dto);
    expect(errors.length).toEqual(0);
  });

  it('should fail if invalid email', async () => {
    dto.email = 'meuEmail@teste.';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('should fail if invalid password', async () => {
    dto.password = '123Aab';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
  });

  it('should fail if invalid name', async () => {
    dto.nome = 'Po';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('nome');
  });
});
