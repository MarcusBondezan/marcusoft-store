import { sign } from 'jsonwebtoken';
import User from '../../domain/entity/User';

export default class TokenGenerator {
  EXPIRES_IN = 1000000;

  constructor (readonly key: string) {}

  sign (user: User, date: Date): string {
    return sign({ email: user.email.value, iat: date.getTime(), expiresIn: this.EXPIRES_IN }, this.key);
  }
}