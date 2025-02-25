import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

export class SimpleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log("🚪 SimpleMiddleware chamado.");

    if (req.query.senha !== "123")
      return res.status(401).send("🚪 Acesso negado via SimpleMiddleware.");

    console.log("🚪 SimpleMiddleware Acesso permitido.");
    next();
  }
}
