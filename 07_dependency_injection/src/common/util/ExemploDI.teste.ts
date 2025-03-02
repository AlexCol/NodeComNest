import { Injectable } from "@nestjs/common";

@Injectable()
export class Utils {
  interteString(s: string) {
    return s.split('').reverse().join('');
  }
}
