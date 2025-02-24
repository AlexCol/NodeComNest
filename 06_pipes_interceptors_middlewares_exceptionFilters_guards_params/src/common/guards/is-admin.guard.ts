import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

@Injectable()
export class IsAdminGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    console.log('IsAdminGuard chamado.');

    console.log('context.getClass():', context.getClass());
    console.log('context.getHandler():', context.getHandler());

    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) {
      return true; // Se for público, permite o acesso sem autenticação
    }

    /* logica de autenticação para dar return true senão cai no return false e bloqueia */
    return false;
  }

}
