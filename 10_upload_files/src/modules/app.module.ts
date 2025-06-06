import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    FilesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
