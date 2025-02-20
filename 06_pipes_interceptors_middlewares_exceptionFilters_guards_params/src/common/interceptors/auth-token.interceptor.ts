import { BadRequestException, CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";
import { Observable } from "rxjs";

export class AuthTokenInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const headerAuth = request.headers["authorization"]?.split(" ");

    if (!headerAuth) throw new BadRequestException("Token not provided");
    if (headerAuth.length != 2 || headerAuth[0] !== "Bearer") {
      throw new BadRequestException("Token malformatted");
    }
    const token = headerAuth[1];

    console.log(`Token: ${token}`);

    return next.handle();
  }
}
