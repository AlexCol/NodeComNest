describe("Teste Exemplo", () => {
  beforeAll(() => {
    //console.log("Isso será executado uma vez antes de todos os testes dentro do describe");
  });

  beforeEach(() => {
    //console.log("Isso será executado antes de cada teste dentro do describe");
  });


  it("can be declared as 'it'", () => { });

  test("or can be declared as 'teste'", () => { });
});


/* //! abaixo um exemplo de testes para arquivos
  describe('uploadPicture', () => {
    it('deve salvar a imagem corretamente e atualizar a pessoa', async () => {
      // Arrange
      const mockFile = {
        originalname: 'test.png',
        size: 2000,
        buffer: Buffer.from('file content'),
      } as Express.Multer.File;

      const mockPessoa = {
        id: 1,
        nome: 'Luiz',
        email: 'luiz@email.com',
      } as Pessoa;

      const tokenPayload = { sub: 1 } as any;

      jest.spyOn(pessoasService, 'findOne').mockResolvedValue(mockPessoa);
      jest.spyOn(pessoaRepository, 'save').mockResolvedValue({
        ...mockPessoa,
        picture: '1.png',
      });

      const filePath = path.resolve(process.cwd(), 'pictures', '1.png');

      // Act
      const result = await pessoasService.uploadPicture(mockFile, tokenPayload);

      // Assert
      expect(fs.writeFile).toHaveBeenCalledWith(filePath, mockFile.buffer);
      expect(pessoaRepository.save).toHaveBeenCalledWith({
        ...mockPessoa,
        picture: '1.png',
      });
      expect(result).toEqual({
        ...mockPessoa,
        picture: '1.png',
      });
    });

    it('deve lançar BadRequestException se o arquivo for muito pequeno', async () => {
      // Arrange
      const mockFile = {
        originalname: 'test.png',
        size: 500, // Menor que 1024 bytes
        buffer: Buffer.from('small content'),
      } as Express.Multer.File;

      const tokenPayload = { sub: 1 } as any;

      // Act & Assert
      await expect(
        pessoasService.uploadPicture(mockFile, tokenPayload),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve lançar NotFoundException se a pessoa não for encontrada', async () => {
      // Arrange
      const mockFile = {
        originalname: 'test.png',
        size: 2000,
        buffer: Buffer.from('file content'),
      } as Express.Multer.File;

      const tokenPayload = { sub: 1 } as any;

      jest
        .spyOn(pessoasService, 'findOne')
        .mockRejectedValue(new NotFoundException());

      // Act & Assert
      await expect(
        pessoasService.uploadPicture(mockFile, tokenPayload),
      ).rejects.toThrow(NotFoundException);
    });
  });
});

*/
