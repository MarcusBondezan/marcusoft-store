import { pbkdf2Sync } from "crypto";
import UserRepository from "../repository/UserRepository";
import TokenGenerator from "./TokenGenerator";

export default class Login {
  constructor (readonly userRepository: UserRepository) {}

  async execute (input: Input): Promise<Output> {
    const user = await this.userRepository.get(input.email);

    const inputPassword = pbkdf2Sync(input.password, user.salt, 64, 100, 'sha512').toString('hex');

    if (user.password === inputPassword) {
      const tokenGenerator = new TokenGenerator('secret');
      return { token: tokenGenerator.sign(user, input.date) };
    } else {
      throw new Error('Authentication failed');
    }

  }
}

type Input = {
  email: string,
  password: string,
  date: Date
}

type Output = {
  token: string
}