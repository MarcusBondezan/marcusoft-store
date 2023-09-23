import { createHash } from "crypto";
import Password from "./Password";

export default class SHA1Password implements Password {

  private constructor(readonly value: string, readonly salt: string) {}
  
  // static factory method
  static create(password: string): SHA1Password {
    const value = createHash('sha1').update(password).digest('hex');
    return new SHA1Password(value, '');
  }

  // static factory method
  static restore(password: string, salt: string): SHA1Password {
    return new SHA1Password(password, salt);
  }

  validate(password: string): boolean {
    const value = createHash('sha1').update(password).digest('hex');
    return value === this.value;
  }
}