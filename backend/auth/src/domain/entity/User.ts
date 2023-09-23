import Email from "./Email";
import PBKDF2Password from "./PBKDF2Password";
import Password from './Password';
import PasswordFactory from "./PasswordFactory";

// Entity - Aggregate Root
export default class User {
  private constructor(public email: Email, public password: Password, readonly passwordType: string) {}

  // static factory method
  static create (email: string, password: string, passwordType: string): User {
    return new User(new Email(email), PasswordFactory.create(passwordType, password), passwordType);
  }

  // static factory method
  static restore (email: string, password: string, salt: string, passwordType: string): User {
    return new User(new Email(email), PasswordFactory.restore(passwordType, password, salt), passwordType);
  }

  isValidPassword(password: string): boolean {
    return this.password.validate(password);
  }
}