import { IsBoolean, isBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { NoProfanity } from "./myValidators";
import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateRecadoDto } from "./create-recado.dto";

export class UpdateRecadoDto extends PartialType(
  OmitType(CreateRecadoDto, ['deId', 'paraId'] as const) //OmitType é um helper do NestJS que remove propriedades de um DTO
) {
  //PartialType é um helper do NestJS que transforma todas as propriedades de um DTO em opcionais

  @IsBoolean({ message: 'O campo lido deve ser um booleano' })
  @IsOptional()
  readonly lido?: boolean;

}
