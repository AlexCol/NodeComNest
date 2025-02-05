import { Injectable } from "@nestjs/common";

@Injectable()
export class ConceitosManualService {
  solucionaHome(): string {
    return 'Service dos Conceitos manual!';
  }
}
