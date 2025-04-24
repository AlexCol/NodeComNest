import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { FastifyRequest } from "fastify";
import { ERole } from "./role-policy";
import { ROLE_POLICY_KEY } from "../auth.constants";

@Injectable()
export class RolePolicyGuard implements CanActivate {
  constructor(
    private reflector: Reflector, // Injetando o refletor para acessar metadados
  ) { }

  //!! feito a role pelo cabeçalho apenas para fins didaticos
  //! em uma aplicação real, seria controlado via banco de dados, se pegando o id do usuário pelo token e checando a role no banco
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest<FastifyRequest>();
      const neededRole = this.reflector.get<ERole | undefined>(ROLE_POLICY_KEY, context.getHandler());

      if (!neededRole) // Se não houver metadado de política de função, retorna true para permitir o acesso
        return true;

      const reqRole = request.headers['role'] as string; // Obtém o papel do cabeçalho da requisição
      if (!reqRole) // Se não houver papel no cabeçalho, lança uma exceção
        throw new UnauthorizedException('Cabeçalho de função não encontrado');

      const userRole = ERole[reqRole]; // Converte o papel do cabeçalho para o enum ERole
      if (userRole !== neededRole) // Se o papel do usuário não corresponder ao necessário, lança uma exceção
        throw new UnauthorizedException('Você não tem permissão para acessar este recurso');
    } catch (error) {
      throw new UnauthorizedException(`Sem permissão. ${error.message}`);
    }
    return true;
  }

  extractTokenFromHeader(request: FastifyRequest): string | null {
    const authotization = request.headers?.authorization;
    if (!authotization) return null; // Se não houver cabeçalho de autorização, retorna null
    if (typeof authotization !== 'string') return null; // Se o cabeçalho não for uma string, retorna null

    const [type, token] = authotization.split(' '); // Divide o cabeçalho em tipo e token
    if (type !== 'Bearer') return null; // Se o tipo não for Bearer, retorna null

    if (!token) return null; // Se não houver token, retorna null

    return token; // Retorna o token extraído do cabeçalho
  }
}
