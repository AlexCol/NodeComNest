import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength, Min, MinLength } from "class-validator";

export class CreatePessoaDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 5,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message: 'A senha deve conter no mínimo 5 caracteres, 1 letra minúscula, 1 letra maiúscula, 1 número e 1 caractere especial',
    },
  )
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  nome: string;
}
