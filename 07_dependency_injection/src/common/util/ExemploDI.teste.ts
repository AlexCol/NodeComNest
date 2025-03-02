import { Injectable } from "@nestjs/common";

@Injectable()
export class Utils {
  inverteString(s: string) {
    return s.split('').reverse().join('');
  }
}

@Injectable()
export class UtilsMock {
  inverteString(s: string) {
    return 'im mocking';
  }
}
