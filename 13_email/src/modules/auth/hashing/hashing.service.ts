export abstract class IHashingService { //fiz com nome de interface para meu entendimento, o Nest não aceita interface como provider
  abstract hashPassword(password: string): Promise<string>;
  abstract comparePassword(password: string, hashedPassword: string): Promise<boolean>;
}
