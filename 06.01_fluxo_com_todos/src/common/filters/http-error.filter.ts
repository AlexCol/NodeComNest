import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";

@Catch(HttpException) //isso é importante, senão vai pegar tudo (lembrando que a tipagem é só pro editor/compilador)
export class HttpErrorFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    console.log(`❌ HttpErrorFilter disparado.`);

    const response = host.switchToHttp().getResponse();
    const status = exception.getStatus();
    const message = `Http error: ${exception.message}`;

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
