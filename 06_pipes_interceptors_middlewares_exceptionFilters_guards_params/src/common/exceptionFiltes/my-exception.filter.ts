import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, NotFoundException } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { FastifyReply } from "fastify";

@Catch(BadRequestException, NotFoundException) //pode-se ocultar essa chamada se quiser que pegue todos os erros
export class MyExceptionFilter<T extends HttpException> implements ExceptionFilter {
  constructor(private httpAdapterHost: HttpAdapterHost) { } // Use This (explicação no if abaixo)

  catch(exception: T, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<FastifyReply>();
    const statusCode = exception.getStatus();

    console.log('Tipo de response (local):', response.constructor.name);
    if (response.constructor.name === 'ServerResponse') { //tratamento caso venha uma response do Express (podem ter sido manipuladas em um middleware)
      return this.httpAdapterHost.httpAdapter.reply(
        response,
        { statusCode, message: exception.message },
        statusCode
      );
    }

    const exceptionResponse = exception.getResponse(); //!tbm é getResponse, mas aqui é da exception

    response.status(statusCode).send({
      statusCode,
      message: `Erro local: ${exceptionResponse['message']}`,
      error: exceptionResponse['error']
    });
  }
}
