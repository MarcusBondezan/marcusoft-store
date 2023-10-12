import AuthGateway from "../gateway/AuthGateway";
import CatalogGateway from "../gateway/CatalogGateway";
import FreightGateway from "../gateway/FreightGateway";

export default interface GatewayFactory {
  createCatalogGateway(): CatalogGateway;
  createFreightGateway(): FreightGateway;
  createAuthGateway(): AuthGateway;
}