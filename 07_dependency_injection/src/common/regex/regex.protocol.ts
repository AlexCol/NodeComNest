
//!se no 'provider' informar como uma classe, eu preciso de uma classe concreta
//!ex: provide: RegexProtocol, useClass: OnlyLowercaseLettersRegex
export abstract class RegexProtocol {
  abstract execute(str: string): string;
}

//! se quiser usar interfaces, no provider informar como um token
// export const ONLY_LOWERCASE_LETTERS_REGEX = 'ONLY_LOWERCASE_LETTERS_REGEX';
//então quem for usar: @Inject('ONLY_LOWERCASE_LETTERS_REGEX') private readonly onlyLowercaseLettersRegex: RegexProtocol,
// export interface RegexProtocol {
//   execute(str: string): string;
// }
