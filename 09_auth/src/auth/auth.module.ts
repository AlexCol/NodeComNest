import { Global, Module } from '@nestjs/common';
import { IHashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pessoa } from 'src/modules/pessoas/entities/pessoa.entity';

@Global() // This module is global, so it can be imported in any other module without needing to be imported again.
@Module({
  imports: [
    TypeOrmModule.forFeature([Pessoa]), // Importing the TypeOrm module for the Pessoa entity
  ],
  controllers: [
    AuthController
  ],
  providers: [
    AuthService,
    { provide: IHashingService, useClass: BcryptService }, // Providing the IHashingService interface with the BcryptService implementation
  ],
  exports: [
    IHashingService
  ],
})
export class AuthModule { }
