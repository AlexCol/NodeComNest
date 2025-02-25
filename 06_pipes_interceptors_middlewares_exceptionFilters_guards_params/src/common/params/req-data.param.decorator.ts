import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { FastifyRequest } from "fastify";

export const ReqDataParam = createParamDecorator(
  (data: keyof FastifyRequest, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<FastifyRequest>();
    return data ? req[data] : req;
  }
);
