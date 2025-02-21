import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, NotFoundException } from "@nestjs/common";
import { FastifyReply } from "fastify";
import { Not } from "typeorm";

@Catch(BadRequestException, NotFoundException) //pode-se ocultar essa chamada se quiser que pegue todos os erros
export class MyExceptionFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<FastifyReply>();

    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    response.status(statusCode).send({
      statusCode,
      message: `Erro local: ${exceptionResponse['message']}`,
      error: exceptionResponse['error']
    });
  }
}
