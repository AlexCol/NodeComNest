import { DynamicModule, Module } from "@nestjs/common";

export type MyDynamicModuleConfigs = {
  apiKey: string;
  apiUrl: string;
};

export const MY_DYNAMIC_CONFIG = 'MY_DYNAMIC_CONFIG';

@Module({})
export class MyDynamcModule {
  static register(
    myModuleConfigs: MyDynamicModuleConfigs, //por conversão, esse nome pode ser options
  ): DynamicModule { //por conversão, esses nomes podem ser register, forRoot ou forRootAsync

    //aqui, você pode fazer validações, configurações, etc, usando os valores de myModuleConfigs
    console.log('apiKey:',
      myModuleConfigs.apiKey,
      'api Url:',
      myModuleConfigs.apiUrl);

    return {
      module: MyDynamcModule,
      imports: [],
      providers: [
        {
          provide: MY_DYNAMIC_CONFIG,
          useValue: myModuleConfigs,
        }
      ],
      controllers: [],
      exports: [MY_DYNAMIC_CONFIG],
      global: false, //por padrão, os módulos são locais, ou seja, não são compartilhados com outros módulos
    }
  }
}
