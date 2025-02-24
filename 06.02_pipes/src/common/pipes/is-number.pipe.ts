import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class IsNumberPipe implements PipeTransform {
  transform(value: any) {
    if (isNaN(value)) {
      throw new BadRequestException('O valor informado não é um número!');
    }

    return Number(value);
  }
}
