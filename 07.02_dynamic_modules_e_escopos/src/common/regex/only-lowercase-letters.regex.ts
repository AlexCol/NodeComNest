import { RegexProtocol } from "./regex.protocol";

export class OnlyLowercaseLettersRegex extends RegexProtocol {
  execute(str: string): string {
    console.log('Usando OnlyLowercaseLettersRegex');
    return str.replace(/[^a-z]/g, '');
  }
}
