import { PessoasController } from "./pessoas.controller";
import { PessoasService } from "./pessoas.service";

describe('PessoasController', () => {
  let _controller: PessoasController;
  const pessoasServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(() => {
    _controller = new PessoasController(pessoasServiceMock as any);
  });

  describe('create', () => {
    it('shoyld use PessaService with correct argument', async () => {
      const argument = { key: 'value' };
      const expected = { anyKey: 'anyValue' };

      jest.spyOn(pessoasServiceMock, 'create').mockResolvedValue(expected);

      const result = await _controller.create(argument as any);

      expect(pessoasServiceMock.create).toHaveBeenCalledWith(argument);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should process Service with limit and page', async () => {
      const query = { page: 1, limit: 2 };
      const expected = { key: 'someValue' };

      jest.spyOn(pessoasServiceMock, 'findAll').mockResolvedValue(expected);

      const result = await _controller.findAll(query);

      expect(result).toEqual(expected);
      expect(pessoasServiceMock.findAll).toHaveBeenCalledWith(query.page, query.limit);
    });
  });

  /*
    não feito para os demais, pois a logica do controller é bem mais simples, e por ter
    testes no service, aqui precisa apenas mockar e informar qual o retorno experto
  */
});
