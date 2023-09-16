import { pbkdf2Sync, randomBytes } from "crypto";

export default class Password {

  private constructor(readonly value: string, readonly salt: string) {}
  
  // static factory method
  static create(password: string): Password {
    const salt = randomBytes(20).toString('hex');
    const value = pbkdf2Sync(password, salt, 64, 100, 'sha512').toString('hex');
    return new Password(value, salt);
  }

  // static factory method
  static restore(password: string, salt: string): Password {
    return new Password(password, salt);
  }

  validate(password: string): boolean {
    const value = pbkdf2Sync(password, this.salt, 64, 100, 'sha512').toString('hex');
    return value === this.value;
  }
}