import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const ReqDataParam = createParamDecorator(
  (data: keyof Request, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    return request[data];
  }
)
