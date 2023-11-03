import HttpServer from "./HttpServer";
import UseCaseFactory from "../factory/UseCaseFactory";
import Queue from "../queue/Queue";

// Interface Adapter
export default class HttpController {
  constructor(httpServer: HttpServer, useCaseFactory: UseCaseFactory, queue: Queue) {
    httpServer.on("post", "/checkout", async function (params: any, body: any, headers: any) {
      body.token = headers.token;
      const checkout = useCaseFactory.createCheckout();
      const output = await checkout.execute(body);
      return output;
    });

    httpServer.on("post", "/checkoutAsync", async function (params: any, body: any, headers: any) {
      // Command - Desacoplei quem chama de quem é chamado
      // Envio a intenção de checkout para uma fila
      // Desacoplo a camada de aplicação (use case) do controller http
      await queue.publish('checkout', body);
    });

    httpServer.on("get", "/orders/:idOrder", async function (params: any, body: any) {
      const getOrder = useCaseFactory.createGetOrder();
      const output = await getOrder.execute(params.idOrder);
      return output;
    });
  }
}