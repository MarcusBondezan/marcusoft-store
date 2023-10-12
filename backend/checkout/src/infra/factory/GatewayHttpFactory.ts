import GatewayFactory from "../../application/factory/GatewayFactory";
import AuthGateway from "../../application/gateway/AuthGateway";
import CatalogGateway from "../../application/gateway/CatalogGateway";
import FreightGateway from "../../application/gateway/FreightGateway";
import AuthHttpGateway from "../gateway/AuthHttpGateway";
import CatalogHttpGateway from "../gateway/CatalogHttpGateway";
import FreightHttpGateway from "../gateway/FreightHttpGateway";
import HttpClient from "../http/HttpClient";

export default class GatewayHttpFactory implements GatewayFactory {
  constructor(readonly httpClient: HttpClient) {}
  
  createCatalogGateway(): CatalogGateway {
    return new CatalogHttpGateway(this.httpClient);
  }
  
  createFreightGateway(): FreightGateway {
    return new FreightHttpGateway(this.httpClient);
  }

  createAuthGateway(): AuthGateway {
    return new AuthHttpGateway(this.httpClient);
  }

}