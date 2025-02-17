import { ArgumentMetadata, BadRequestException, Inject, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ParseIntIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param' || metadata.data !== 'id') {
      return value;
    }

    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('ParseIntIdPipe espera uma string numerica!');
    }

    if (val < 0) {
      throw new BadRequestException('ParseIntIdPipe espera um numero positivo!');
    }

    return val;
  }

}
