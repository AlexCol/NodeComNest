import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

export class ChangeDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    console.log("ChangeDataInterceptor chamado.");
    return next.handle().pipe(
      map(data => {
        console.log("Alterando dados...");
        return { data };
        //return [];
      })
    );
  }
}
