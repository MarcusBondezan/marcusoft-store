import GatewayFactory from "../factory/GatewayFactory";
import AuthGateway from "../gateway/AuthGateway";
import UseCase from "../usecase/UseCase";

export default class AuthDecorator implements UseCase {
  authGateway: AuthGateway;

  constructor(readonly useCase: UseCase, readonly gatewayFactory: GatewayFactory) {
    this.authGateway = gatewayFactory.createAuthGateway();
  }

  async execute(input?: any): Promise<any> {
    if (input.token) {
      const session = await this.authGateway.verify(input.token);
      console.log({session})
      if (!session) throw new Error('Authentication failed');
    }
    return this.useCase.execute(input);
  }

}