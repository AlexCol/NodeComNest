import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: false })
export class NoProfanityConstraint implements ValidatorConstraintInterface {
  validate(text: string) {
    const palavrasProibidas = ['ofensivo', 'banido', 'proibido'];
    if (!text) return true;
    return !palavrasProibidas.some((palavra) => text.toLowerCase().includes(palavra));
  }

  defaultMessage() {
    return 'O texto contém palavras proibidas!';
  }
}

// com esse bloco, estamos criando o decorator NoProfanity que usa NoProfanityConstraint para validar
export function NoProfanity(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: NoProfanityConstraint,
    });
  };
}
