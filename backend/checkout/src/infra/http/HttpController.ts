import HttpServer from "./HttpServer";
import UseCaseFactory from "../factory/UseCaseFactory";

// Interface Adapter
export default class HttpController {
  constructor(httpServer: HttpServer, useCaseFactory: UseCaseFactory) {
    httpServer.on("post", "/checkout", async function (params: any, body: any, headers: any) {
      body.token = headers.token;
      const checkout = useCaseFactory.createCheckout();
      const output = await checkout.execute(body);
      return output;
    });

    httpServer.on("get", "/orders/:idOrder", async function (params: any, body: any) {
      const getOrder = useCaseFactory.createGetOrder();
      const output = await getOrder.execute(params.idOrder);
      return output;
    });
  }
}