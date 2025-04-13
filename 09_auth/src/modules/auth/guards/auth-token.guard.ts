import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { FastifyRequest } from "fastify";
import jwtConfig from "../config/jwt.config";
import { ConfigType } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { REQUEST_TOKEN_PAYLOAD_KEY } from "../auth.constants";

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService, // Injetando o serviço JWT para verificar o token
    @Inject(jwtConfig.KEY) private readonly jwtConfiguration: ConfigType<typeof jwtConfig>, // Injetando a configuração do JWT
    private reflector: Reflector, // Injetando o refletor para acessar metadados
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const token = this.extractTokenFromHeader(request);

    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic && !token) //se tiver token, mesmo que seja publico, ele será validado e barrado se mandar um jwt inválido
      return true;

    if (!token)
      throw new UnauthorizedException('Token não encontrado');

    try {
      const payload = await this.jwtService.verifyAsync(token, this.jwtConfiguration);
      request[REQUEST_TOKEN_PAYLOAD_KEY] = payload; // Armazena o payload do token na requisição para uso posterior
    } catch (error) {
      console.log(error.message);
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    return true; // Se o token for válido, retorna true para permitir o acesso
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
