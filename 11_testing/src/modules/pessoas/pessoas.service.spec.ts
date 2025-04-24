describe("PessoasService", () => {
  beforeAll(() => {
    //console.log("Isso será executado uma vez antes de todos os testes dentro do describe");
  });

  beforeEach(() => {
    //console.log("Isso será executado antes de cada teste dentro do describe");
  });

  it("should be defined1", () => {
    expect(true).toBe(true);
  });

  test("should be defined2", () => {
    expect(true).toBe(true);
  });
});

describe("PessoasService2", () => {
  //fora do escopo do outro describe, não terá acesso a variáveis definidas no outro describe
  //também não irá disparar o beforeAll do outro describe
  it("should be defined3", () => {
    expect(true).toBe(true);
  });
});
