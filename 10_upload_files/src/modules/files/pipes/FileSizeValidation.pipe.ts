import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // "value" is an object containing the file's attributes and metadata
    const oneKb = 5000;

    /*ver se é array*/
    if (Array.isArray(value)) {
      for (const file of value) {
        if (file.size > oneKb) {
          throw new BadRequestException(`FileSizeValidationPipe: O arquivo é muito grande!`);
        }
      }
      return value; //o retorno em um pipe, substitui o valor original
    }

    if (value.size > oneKb) {
      throw new BadRequestException(`FileSizeValidationPipe: O arquivo é muito grande!`);
    }
    return value; //o retorno em um pipe, substitui o valor original

  }
}
