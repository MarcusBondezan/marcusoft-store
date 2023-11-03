import UseCaseFactory from "../factory/UseCaseFactory";
import Queue from "./Queue";

export default class QueueController {
  constructor(readonly queue: Queue, readonly useCaseFactory: UseCaseFactory) {
    const checkout = useCaseFactory.createCheckout();

    // Command handler
    queue.on('checkout', async function (input: any) {
      await checkout.execute(input);
    });
  }
}