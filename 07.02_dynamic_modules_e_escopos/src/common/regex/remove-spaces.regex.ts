import { RegexProtocol } from "./regex.protocol";

export class RemoveSpacesRegex extends RegexProtocol {
  execute(str: string): string {
    console.log('Usando RemoveSpacesRegex');
    return str.replace(/\s/g, '');
  }
}
