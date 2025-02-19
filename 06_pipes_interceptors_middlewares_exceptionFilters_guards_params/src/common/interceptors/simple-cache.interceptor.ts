import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { Observable, of, tap } from "rxjs";

export class SimpleCacheInterceptor implements NestInterceptor {
  private readonly cache = new Map<string, any>();
  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    console.log("SimpleCacheInterceptor chamado.");
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const url = request.url;

    if (this.cache.has(url)) {
      console.log("Cache hit!");
      return of(this.cache.get(url));
    }

    //await new Promise(resolve => setTimeout(resolve, 5000)); //pra simular que foi feita a requisição

    return next.handle().pipe(
      tap(data => {
        this.cache.set(url, data);
        console.log("Cache miss and then created!");
      })
    );
  }

}
