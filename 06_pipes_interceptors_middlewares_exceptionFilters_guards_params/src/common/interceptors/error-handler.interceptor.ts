import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { catchError, Observable } from "rxjs";

export class ErrorHandlerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    console.log("ErrorHandlerInterceptor chamado.");

    return next.handle().pipe(
      catchError((error) => {
        console.log("Erro capturado no interceptor.");
        throw error;
      })
    );
  }

}
