# Configuração do Projeto NestJS

## <span style="color: red;">Criação do Projeto</span>

Para criar um novo projeto NestJS:
```sh
nest new . --skip-git
```

## <span style="color: yellow;">Instalação de Pacotes</span>

### Remover Express (para usar Fastify)
```sh
npm uninstall @nestjs/platform-express
npm uninstall @types/express
```

### Instalar o Fastify
```sh
npm i @nestjs/platform-fastify@10.0.0  # (@xx - trocar pela versão do @nestjs/common)
npm i fastify
```

### Instalar TypeORM para Bancos de Dados
```sh
npm i @nestjs/typeorm
npm i typeorm
```

### Instalar Pacote para PostgreSQL (ou outro banco de dados)
Se estiver usando PostgreSQL:
```sh
npm i pg
```
Caso esteja usando outro banco, procure o pacote correspondente.

### Usar Arquivo `.env` (Configurado no Módulo Raiz)
```sh
npm i @nestjs/config
```

### Instalar `class-validator` para `ValidationPipe()`
```sh
npm i class-validator
```

### Instalar `class-transformer` para Transformação de Classes
```sh
npm i class-transformer
```

### Instalar `@nestjs/mapped-types` para Mapear Tipos
```sh
npm i @nestjs/mapped-types
```

## <span style="color: green;">Configurações Iniciais</span>

### Ajustar o Arquivo `main.ts`
Substituir:
```ts
const app = await NestFactory.create(AppModule);
```
Por:
```ts
const app = await NestFactory.create(AppModule, new FastifyAdapter());
```

### Adicionar `.env` no `app.module.ts` (Nos Imports)
```ts
ConfigModule.forRoot()
```
## <span style="color: orange;">Configurando Banco de Dados</span>
Adicionar a Configuração do Banco de Dados no Arquivo `.env` (substituindo por dados reais):
```env
DB_TYPE = postgres
DB_USER = root
DB_PASS = nest@852ad
DB_HOST = 127.0.0.1
DB_PORT = 5432
DB_DATABASE = nest
DB_AUTO_LOAD_ENTITIES = true
DB_SYNCHRONIZE = true
```

Adicionar um arquivo `src/DataBase/ConfigTypeOrm.ts` (pode ser qualquer nome), para carregas as configurações.

Em `app.module.ts`, adicionar a configuração usando `TypeOrmModule.forRootAsync`:
```ts
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Importa o ConfigModule para resolver dependências
      // Usa a classe ConfigTypeOrm para fornecer as configurações
      useClass: ConfigTypeOrm,
    }),
```
