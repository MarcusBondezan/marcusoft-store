import * as dotenv from 'dotenv'

import DatabaseRepositoryFactory from './infra/factory/DatabaseRepositoryFactory';
import PgPromiseAdapter from './infra/database/PgPromiseAdapter';
import ExpressAdapter from './infra/http/ExpressAdapter';
import HttpController from './infra/http/HttpController';
import UseCaseFactory from './infra/factory/UseCaseFactory';

dotenv.config()
const port = Number(process.env.API_PORT) || 3000;

const connection = new PgPromiseAdapter();
connection.connect();
const repositoryFactory = new DatabaseRepositoryFactory(connection);
const useCaseFactory = new UseCaseFactory(repositoryFactory);
const httpServer = new ExpressAdapter();
new HttpController(httpServer, useCaseFactory);
httpServer.listen(port);