import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, NotFoundException } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { FastifyReply, FastifyRequest } from "fastify";

@Catch(NotFoundException) //pode-se ocultar essa chamada se quiser que pegue todos os erros
export class NotFoundFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<FastifyReply>();
    const request = context.getRequest<FastifyRequest>();
    const statusCode = exception.getStatus();

    const exceptionResponse = exception.getResponse(); //!tbm é getResponse, mas aqui é da exception

    if (exceptionResponse['message'] === 'Not Found') {
      exceptionResponse['message'] = `Cannot ${request.method} ${request.url} - tratada`;
      exceptionResponse['error'] = 'Not Found';
    }

    response.status(statusCode).send({
      statusCode,
      message: `${exceptionResponse['message']}`,
      error: exceptionResponse['error']
    });
  }
}
