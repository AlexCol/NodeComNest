import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Response } from "express";
import { finalize, Observable, tap } from "rxjs";

export class AddHeaderInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    console.log("⌚ AddHeaderInterceptor chamado.");

    const response = context.switchToHttp().getResponse<Response>();
    response.header("X-Custom-Header", "Meu cabeçalho customizado.");

    return next.handle().pipe(
      finalize(() => { // Sempre chamado, independentemente do sucesso ou falha da requisição.
        console.log('[AddHeaderInterceptor finalize] Called');
      }),
      tap({
        next: () => console.log('[AddHeaderInterceptor next] Called'), // Chamado quando o controller retorna uma resposta com sucesso.
        error: () => console.log('[AddHeaderInterceptor error] Called'), // Chamado se um erro ocorrer durante o processamento da requisição.
        complete: () => console.log('[AddHeaderInterceptor tap complete] Called') // Chamado quando o fluxo de dados do Observable é concluído com sucesso.
      })
    );
  }
}
