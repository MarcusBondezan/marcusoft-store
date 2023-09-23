import { createHash } from "crypto";
import Password from "./Password";

export default class MD5Password implements Password {

  private constructor(readonly value: string, readonly salt: string) {}
  
  // static factory method
  static create(password: string): MD5Password {
    const value = createHash('md5').update(password).digest('hex');
    return new MD5Password(value, '');
  }

  // static factory method
  static restore(password: string, salt: string): MD5Password {
    return new MD5Password(password, salt);
  }

  validate(password: string): boolean {
    const value = createHash('md5').update(password).digest('hex');
    return value === this.value;
  }
}