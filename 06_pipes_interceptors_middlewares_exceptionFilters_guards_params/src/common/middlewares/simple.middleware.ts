import { BadRequestException, Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";

@Injectable()
export class SimpleMiddleware implements NestMiddleware {
  use(req: FastifyRequest, res: FastifyReply, next: () => void) {
    console.log("SimpleMiddleware chamado.");

    const auth = req.headers['authorization'];
    if (!auth) throw new BadRequestException('Token não informado - SimpleMiddleware.');

    req['user'] = {
      nome: 'Fulano',
      sobreNome: 'de Tal'
    }
    console.log('Usuário autenticado.');

    return next();
  }
}
