import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { FastifyRequest } from "fastify";

export const UrlParam = createParamDecorator((_: string, context: ExecutionContext) => {
  var req = context.switchToHttp().getRequest<FastifyRequest>();
  return req.url;
});
