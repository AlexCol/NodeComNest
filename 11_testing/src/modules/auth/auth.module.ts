import { Global, Module } from '@nestjs/common';
import { IHashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pessoa } from 'src/modules/pessoas/entities/pessoa.entity';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthTokenGuard } from './guards/auth-token.guard';
import { RolePolicy } from './guards/role-policy';
import { RolePolicyGuard } from './guards/role-policy.guard';

@Global() // This module is global, so it can be imported in any other module without needing to be imported again.
@Module({
  imports: [
    TypeOrmModule.forFeature([Pessoa]), // Importing the TypeOrm module for the Pessoa entity
    ConfigModule.forFeature(jwtConfig), // Importing the ConfigModule for JWT configuration
    JwtModule.registerAsync(jwtConfig.asProvider()), // Registering the JwtModule asynchronously with the JWT configuration
  ],
  controllers: [
    AuthController
  ],
  providers: [
    AuthService,
    { provide: IHashingService, useClass: BcryptService }, // Providing the IHashingService interface with the BcryptService implementation
    { provide: APP_GUARD, useClass: AuthTokenGuard }, // Registering the AuthTokenGuard as a global guard
    { provide: APP_GUARD, useClass: RolePolicyGuard }, // Registering the RolePolicyGuard as a global guard
  ],
  exports: [
    IHashingService
  ],
})
export class AuthModule { }
