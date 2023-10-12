import HttpServer from "./HttpServer";
import UseCaseFactory from "../factory/UseCaseFactory";

// Interface Adapter
export default class HttpController {
  constructor(httpServer: HttpServer, useCaseFactory: UseCaseFactory) {

    httpServer.on("post", "/verify", async function (params: any, body: any, headers: any) {
      const verify = useCaseFactory.createVerify();
      const output = await verify.execute(body.token);
      return output;
    });
  }
}