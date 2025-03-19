import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength, Validate } from "class-validator";
import { NoProfanityConstraint } from "./myValidators";

export class CreateRecadoDto {
  @IsString({ message: 'O texto deve ser uma string' })
  @IsNotEmpty({ message: 'O texto é obrigatório' })
  @MinLength(3, { message: 'O texto deve ter no mínimo 3 caracteres' })
  @MaxLength(255, { message: 'O texto deve ter no máximo 255 caracteres' })
  //!Em myValidators cria-se a classe de validação (que pode ser usado dentro do validate)
  //! e o decorator que usa essa classe para validar (que por sua vez pode ser usado no DTO)
  //? @NoProfanity() //usando o decorator criado
  @Validate(NoProfanityConstraint) //usando o decorator do class-validator
  readonly texto: string;

  @IsNumber()
  @IsNotEmpty()
  readonly deId: number;

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
