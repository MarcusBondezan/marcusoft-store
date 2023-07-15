import HttpServer from "./HttpServer";
import UseCaseFactory from "../factory/UseCaseFactory";

// Interface Adapter
export default class HttpController {
  constructor(httpServer: HttpServer, useCaseFactory: UseCaseFactory) {
    httpServer.on("post", "/freight/simulate", async function (params: any, body: any) {
      const SimulateFreight = useCaseFactory.createSimulateFreight();
      const output = await SimulateFreight.execute(body);
      return output;
    });
  }
}