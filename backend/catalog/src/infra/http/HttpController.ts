import HttpServer from "./HttpServer";
import UseCaseFactory from "../factory/UseCaseFactory";

// Interface Adapter
export default class HttpController {
  constructor(httpServer: HttpServer, useCaseFactory: UseCaseFactory) {
    httpServer.on("get", "/products", async function (params: any, body: any, headers: any) {
      const contentType = headers['content-type'] || 'application/json';
      const getProducts = useCaseFactory.createGetProducts(contentType);
      const output = await getProducts.execute();
      return output;
    });

    httpServer.on("get", "/product/:idProduct", async function (params: any, body: any, headers: any) {
      const getProduct = useCaseFactory.createGetProduct();
      const output = await getProduct.execute(params.idProduct);
      return output;
    });
  }
}