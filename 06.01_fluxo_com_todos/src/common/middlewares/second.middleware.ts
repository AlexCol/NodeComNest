import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

export class SecondMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log("🚪 SecondMiddleware chamado.");

    res.header("X-Second-Middleware", "SecondMiddleware");

    next();
  }
}
