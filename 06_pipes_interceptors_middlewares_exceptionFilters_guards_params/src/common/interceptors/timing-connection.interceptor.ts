import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { finalize, Observable, tap } from "rxjs";

export class TimingConnectionInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    console.log('TimingConnectionInterceptor chamado.');

    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, 3000));

    return next.handle().pipe(
      //tap só é executado se o next.handle() for executado com sucesso (exceções não tratadas fazo tap não ser chamado)
      //finalize é chamado sempre, independente se o next.handle() foi executado com sucesso ou não
      tap(
        (retornoDoNext) => {
          console.log(retornoDoNext);
          const finalTime = Date.now();
          const elapsedTime = finalTime - startTime;
          console.log(`Tempo de execução: ${elapsedTime}ms`);
        }
      )
    );
  }

}
