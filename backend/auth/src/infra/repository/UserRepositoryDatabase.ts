import DatabaseConnection from "../database/DabaseConnection";
import UserRepository from "../../application/repository/UserRepository";
import User from "../../domain/entity/User";

export default class UserRepositoryDatabase implements UserRepository {
  constructor (readonly connection: DatabaseConnection) {}

  async save(user: User): Promise<void> {
    await this.connection.query('insert into "user" (email, password, salt, password_type) values ($1, $2, $3, $4)', [user.email.value, user.password.value, user.password.salt, user.passwordType]);
  }

  async update(user: User): Promise<void> {
    await this.connection.query('update "user" set email = $1, password = $2, salt = $3 where email = $1', [user.email.value, user.password.value, user.password.salt])
  }

  async get(email: string): Promise<User> {
    const [userData] = await this.connection.query('select * from "user" us where us.email = $1', [email]);
    return User.restore(userData.email, userData.password, userData.salt, userData.password_type);
  }

  async delete(email: string): Promise<void> {
    await this.connection.query('delete from "user" where email = $1', [email]);
  }

}