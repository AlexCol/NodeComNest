export class ResponseRecadoDto {
  id: number;
  texto: string;
  lido: boolean;
  criadoEm: Date;
  createdAt?: Date;
  updatedAt?: Date;
  de: {
    id: number;
    nome: string;
  };
  para: {
    id: number;
    nome: string;
  };
}
