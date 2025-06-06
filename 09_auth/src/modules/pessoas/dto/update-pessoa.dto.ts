import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreatePessoaDto } from './create-pessoa.dto';
import { IsOptional } from 'class-validator';

//export class UpdatePessoaDto extends PartialType(CreatePessoaDto) {}

//assim consigo omitir o campo email que tem no createPessoaDto
export class UpdatePessoaDto extends PartialType(OmitType(CreatePessoaDto, ['email'] as const)) {
  @IsOptional()
  ativo: boolean;
}
