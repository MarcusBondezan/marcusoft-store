import * as dotenv from 'dotenv'

import DatabaseRepositoryFactory from './infra/factory/DatabaseRepositoryFactory';
import PgPromiseAdapter from './infra/database/PgPromiseAdapter';
import ExpressAdapter from './infra/http/ExpressAdapter';
import HttpController from './infra/http/HttpController';
import UseCaseFactory from './infra/factory/UseCaseFactory';
import RabbitMQAdapter from './infra/queue/RabbitMQAdapter';
import QueueController from './infra/queue/QueueController';

dotenv.config();
const port = Number(process.env.API_PORT) || 3000;

async function main () {
  const connection = new PgPromiseAdapter();
  connection.connect();
  const repositoryFactory = new DatabaseRepositoryFactory(connection);
  const useCaseFactory = new UseCaseFactory(repositoryFactory);
  const queue = new RabbitMQAdapter();
  await queue.connect();
  new QueueController(queue, useCaseFactory);
  const httpServer = new ExpressAdapter();
  new HttpController(httpServer, useCaseFactory);
  httpServer.listen(port);
}

main();