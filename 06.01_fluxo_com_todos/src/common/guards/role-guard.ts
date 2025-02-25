import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { Observable } from "rxjs";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    console.log('🔐 RoleGuard chamado.');

    const request = context.switchToHttp().getRequest<Request>();
    const user = request['user'];
    if (user.role !== 'admin') {
      throw new BadRequestException('Acesso não autorizado');
    }

    return true;
  }
}
