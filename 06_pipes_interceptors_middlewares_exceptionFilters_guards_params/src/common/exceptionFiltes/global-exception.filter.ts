import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { FastifyReply } from "fastify";
import { Not } from "typeorm";

export class GlobalExceptionFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<FastifyReply>();

    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    console.log('exceptionResponse:', exceptionResponse);

    const error =
      typeof response === 'string'
        ? { message: `Erro global: ${exceptionResponse}` }
        : exceptionResponse as object;

    response.status(statusCode).send({
      error
    });

    /*
        if (exceptionResponse instanceof Object) {
      response.status(statusCode).send({
        statusCode,
        message: `Erro global: ${exceptionResponse['message']}`,
        error: exceptionResponse['error']
      });
    } else {
      response.status(statusCode).send({
        statusCode,
        message: `Erro global: ${exceptionResponse}`
      });
    }
    */
  }
}
