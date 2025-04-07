import { Global, Module } from '@nestjs/common';
import { IHashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';

@Global() // This module is global, so it can be imported in any other module without needing to be imported again.
@Module({
  providers: [
    {
      provide: IHashingService,
      useClass: BcryptService
    }
  ],
  exports: [IHashingService]
})
export class AuthModule { }
