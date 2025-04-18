import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreateRecadoDto {
  @IsString({ message: 'O texto deve ser uma string' })
  @IsNotEmpty({ message: 'O texto é obrigatório' })
  @MinLength(3, { message: 'O texto deve ter no mínimo 3 caracteres' })
  @MaxLength(255, { message: 'O texto deve ter no máximo 255 caracteres' })
  //!Em myValidators cria-se a classe de validação (que pode ser usado dentro do validate)
  //! e o decorator que usa essa classe para validar (que por sua vez pode ser usado no DTO)
  readonly texto: string;

  // @IsNumber()
  // @IsNotEmpty()
  // readonly deId: number; //será alimentado pelo id do token

  @IsNumber()
  @IsNotEmpty()
  readonly paraId: number;
}

/*
Outros exemplo de validação
@IsNumber()
@IsBoolean()
@isDate()
*/
