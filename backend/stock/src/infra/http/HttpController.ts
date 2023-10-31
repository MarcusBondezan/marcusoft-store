import HttpServer from "./HttpServer";
import UseCaseFactory from "../factory/UseCaseFactory";

// Interface Adapter
export default class HttpController {
  constructor(httpServer: HttpServer, useCaseFactory: UseCaseFactory) {
    httpServer.on("post", "/decreaseStock", async function (params: any, body: any) {
      const decreaseStock = useCaseFactory.createDecreaseStock();
      await decreaseStock.execute(body);
    });

    httpServer.on("post", "/getStock", async function (params: any, body: any) {
      const getStock = useCaseFactory.createGetStock();
      const output = await getStock.execute(body.idProduct);
      return output;
    });

    httpServer.on("post", "/cleanStock", async function (params: any, body: any) {
      const cleanStock = useCaseFactory.createCleanStock();
      await cleanStock.execute(body.idProduct);
    });

  }
}