import UseCaseFactory from "../factory/UseCaseFactory";
import Queue from "./Queue";

export default class QueueController {
  constructor(readonly queue: Queue, readonly useCaseFactory: UseCaseFactory) {
    const decreaseStock = useCaseFactory.createDecreaseStock();
    queue.on('orderPlaced', async function (input: any) {
      await decreaseStock.execute(input);
    })
  }
}