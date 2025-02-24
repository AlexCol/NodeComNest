import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request, Response } from "express";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    console.log('🔐 AuthGuard chamado.');

    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) {
      return true; // Se for público, permite o acesso sem autenticação
    }

    const request = context.switchToHttp().getRequest<Request>();
    const auth = request.headers.authorization?.split(' ');

    if (!auth) {
      throw new BadRequestException('Token não informado');
    }

    if (auth[0] !== 'Bearer') {
      throw new BadRequestException('Token inválido');
    }

    const role = auth[1];

    request['user'] = {
      id: 1,
      name: 'Usuário de teste',
      role: role.includes('admin') ? 'admin' : 'user'
    };

    return true;
  }
}
