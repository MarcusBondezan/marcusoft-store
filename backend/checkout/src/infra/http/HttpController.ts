import HttpServer from "./HttpServer";
import UseCaseFactory from "../factory/UseCaseFactory";

// Interface Adapter
export default class HttpController {
  constructor(httpServer: HttpServer, useCaseFactory: UseCaseFactory) {
    httpServer.on("post", "/checkout", async function (params: any, body: any) {
      const checkout = useCaseFactory.createCheckout();
      const output = await checkout.execute(body);
      return output;
    });
    httpServer.on("get", "/products", async function (params: any, body: any, headers: any) {
      const contentType = headers['content-type'] || 'application/json';
      const getProducts = useCaseFactory.createGetProducts(contentType);
      const output = await getProducts.execute();
      return output;
    });
  }
}