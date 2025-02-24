import { Injectable } from '@nestjs/common';
import { CreatePipeDto } from './dto/create-pipe.dto';
import { UpdatePipeDto } from './dto/update-pipe.dto';

@Injectable()
export class PipesService {
  findAll() {
    return `This action returns all pipes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pipe`;
  }

}
