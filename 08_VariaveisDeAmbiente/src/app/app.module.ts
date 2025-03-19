import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecadosModule } from 'src/recados/recados.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import appConfig from './app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      //envFilePath: '.env', //opcional, por padrão já é '.env', mas caso tenha o arquivo em outro local, informe aqui
      //ignoreEnvFile: false, //opcional, por padrão é false, mas caso não queira carregar o arquivo .env, informe true
      //load: [appConfig], //importa o módulo de configuração (usar no exemplo 2 abaixo)
    }), //importa o módulo de configuração
    // TypeOrmModule.forRoot({ //!usando direto do process
    //   type: process.env.DB_TYPE as any,
    //   host: process.env.DB_HOST,
    //   port: process.env.DB_PORT as any,
    //   username: process.env.DB_USER,
    //   password: process.env.DB_PASS,
    //   database: process.env.DB_DATABASE,
    //   autoLoadEntities: Boolean(process.env.DB_AUTO_LOAD_ENTITIES), //carrega automaticamente as entidades
    //   synchronize: Boolean(process.env.DB_SYNCHRONIZE), //sincroniza o banco de dados com as entidades, não usar em produção
    // }),
    // TypeOrmModule.forRootAsync( //!usando o ConfigService (que importou o appConfig criado para conter as variáveis de ambiente)
    //   {
    //     imports: [ConfigModule],
    //     inject: [ConfigService],
    //     useFactory: async (configService: ConfigService) => {
    //       return {
    //         type: configService.get<string>('database.type') as any,
    //         host: configService.get<string>('database.host'),
    //         port: configService.get<number>('database.port'),
    //         username: configService.get<string>('database.username'),
    //         password: configService.get<string>('database.password'),
    //         database: configService.get<string>('database.database'),
    //         autoLoadEntities: configService.get<boolean>('database.autoLoadEntities'),
    //         synchronize: configService.get<boolean>('database.synchronize'),
    //       }
    //     }
    //   }
    // ),
    ConfigModule.forFeature(appConfig), //importa o módulo de configuração
    TypeOrmModule.forRootAsync( //!usando o ConfigType (que importou o appConfig criado para conter as variáveis de ambiente) - testando em AppController
      {
        imports: [ConfigModule.forFeature(appConfig)],
        inject: [appConfig.KEY],
        useFactory: async (configService: ConfigType<typeof appConfig>) => {
          return {
            type: configService.database.type,
            host: configService.database.host,
            port: configService.database.port,
            username: configService.database.username,
            password: configService.database.password,
            database: configService.database.database,
            autoLoadEntities: configService.database.autoLoadEntities,
            synchronize: configService.database.synchronize,
          }
        }
      }
    ),
    RecadosModule,
    PessoasModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    const var1 = process.env.ESSA_E_UMA_VARIAVEL_DE_AMBIENTE || 'deu ruim';
    const var2 = process.env.ESSA_E_UMA_VARIAVEL_DE_AMBIENTE2 || 'deu ruim';
    console.log(var1);
    console.log(var2);

    const var3 = process.env.QUE_COISA || 'não existe, que coisa';
    console.log(var3);
  }
}
