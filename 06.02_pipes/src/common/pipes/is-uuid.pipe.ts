import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class IsUuidPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param' || metadata.data !== 'uuid')
      return value;

    if (!this.isUuid(value))
      throw new BadRequestException('O valor informado não é um UUID!');

    return value;
  }

  private isUuid(value: string): boolean {
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(value);
  }

}
