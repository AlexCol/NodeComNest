// export default () => ({
//   database: {
//     type: process.env.DB_TYPE as any,
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT as any,
//     username: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_DATABASE,
//     autoLoadEntities: Boolean(process.env.DB_AUTO_LOAD_ENTITIES), //carrega automaticamente as entidades
//     synchronize: Boolean(process.env.DB_SYNCHRONIZE), //sincroniza o banco de dados com as entidades, não usar em produção
//   },
//   environment: process.env.NODE_ENV || 'development',
// });

import { registerAs } from "@nestjs/config";

export default registerAs('app', () => ({
  database: {
    type: process.env.DB_TYPE as any,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT as any,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    autoLoadEntities: Boolean(process.env.DB_AUTO_LOAD_ENTITIES), //carrega automaticamente as entidades
    synchronize: Boolean(process.env.DB_SYNCHRONIZE), //sincroniza o banco de dados com as entidades, não usar em produção
  },
  environment: process.env.NODE_ENV || 'development',
}));
