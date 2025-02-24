import { Injectable } from '@nestjs/common';

@Injectable()
export class ExemplosService {
  findAll() {
    return `This action returns all exemplos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} exemplo`;
  }

  findOneUuid(uuid: string) {
    return `This action returns a #${uuid} exemplo -- uuid`;
  }
}
