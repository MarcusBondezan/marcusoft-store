import * as dotenv from 'dotenv'

import DatabaseRepositoryFactory from './infra/factory/DatabaseRepositoryFactory';
import PgPromiseAdapter from './infra/database/PgPromiseAdapter';
import ExpressAdapter from './infra/http/ExpressAdapter';
import HttpController from './infra/http/HttpController';
import UseCaseFactory from './infra/factory/UseCaseFactory';
import GatewayHttpFactory from './infra/factory/GatewayHttpFactory';
import AxiosAdapter from './infra/http/AxiosAdapter';
import RabbitMQAdapter from './infra/queue/RabbitMQAdapter';

dotenv.config()
const port = Number(process.env.API_PORT) || 3000;

async function main() {
  const connection = new PgPromiseAdapter();
  connection.connect();
  const repositoryFactory = new DatabaseRepositoryFactory(connection);
  const httpClient = new AxiosAdapter();
  const queue = new RabbitMQAdapter();
  await queue.connect();
  const gatewayFactory = new GatewayHttpFactory(httpClient);
  const useCaseFactory = new UseCaseFactory(repositoryFactory, gatewayFactory, queue);
  const httpServer = new ExpressAdapter();
  new HttpController(httpServer, useCaseFactory);
  httpServer.listen(port);
}

main();