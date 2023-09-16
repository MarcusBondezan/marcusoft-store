import { pbkdf2Sync, randomBytes } from 'crypto';
import Email from "./Email";

export default class User {
  email: Email;

  private constructor(email: string, readonly password: string, readonly salt: string) {
    this.email = new Email(email);
  }

  // static factory method
  static create (email: string, password: string): User {
    const salt = randomBytes(20).toString('hex')
    const hash = pbkdf2Sync(password, salt, 64, 100, 'sha512').toString('hex');
    return new User(email, hash, salt);
  }

  // static factory method
  static restore (email: string, password: string, salt: string): User {
    return new User(email, password, salt);
  }
}