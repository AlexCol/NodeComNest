import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

export class TimingConnectionInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    console.log('TimingConnectionInterceptor chamado.');

    await new Promise(resolve => setTimeout(resolve, 3000));

    return next.handle().pipe(
      tap(
        () => {
          console.log(`TimingConnectionInterceptor executado Depois de 3 segundos`);
        }
      )
    );
  }

}
