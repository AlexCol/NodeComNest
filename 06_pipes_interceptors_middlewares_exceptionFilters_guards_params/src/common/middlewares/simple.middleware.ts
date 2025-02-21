import { BadRequestException, Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";

@Injectable()
export class SimpleMiddleware implements NestMiddleware {
  use(req: FastifyRequest, res: FastifyReply, next: () => void) {
    console.log("SimpleMiddleware chamado.");

    const auth = req.headers['authorization'];
    if (!auth) throw new BadRequestException('Token não informado - SimpleMiddleware.');

    req['user'] = { //!funciona para o Express, para o fastify não, pois mesmo que adicione no middleare, a request é imutavel no fastify - precisnado ser obtida do 'contexto'
      nome: 'Fulano',
      sobreNome: 'de Tal'
    }
    console.log('Usuário autenticado.');

    next();

    //! so funciona no express
    // res.on('finish', () => {
    //   console.log('Resposta enviada');
    // });

  }
}
