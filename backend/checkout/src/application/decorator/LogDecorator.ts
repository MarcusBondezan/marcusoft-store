import UseCase from "../usecase/UseCase";

export default class LogDecorator implements UseCase {

  constructor(readonly useCase: UseCase) {}

  async execute(input?: any): Promise<any> {
    console.log({ input });
    return this.useCase.execute(input);
  }

}