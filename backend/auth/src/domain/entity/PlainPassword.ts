import Password from "./Password";

export default class PlainPassword implements Password {

  private constructor(readonly value: string, readonly salt: string) {}
  
  // static factory method
  static create(password: string): PlainPassword {
    return new PlainPassword(password, '');
  }

  // static factory method
  static restore(password: string, salt: string): PlainPassword {
    return new PlainPassword(password, salt);
  }

  validate(password: string): boolean {
    return password === this.value;
  }
}