import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";
import { Observable } from "rxjs";

export class AddHeaderInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    console.log("AddHeaderInterceptor chamado.");

    const response = context.switchToHttp().getResponse<FastifyReply>();
    //!cuidar caracteres especiais se usar FastifyReply, pois ele não trata utf8
    response.header("X-Custom-Header", "Meu cabecalho customizado.");

    return next.handle();
  }
}
