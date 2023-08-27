import * as dotenv from 'dotenv'

import DatabaseRepositoryFactory from './infra/factory/DatabaseRepositoryFactory';
import PgPromiseAdapter from './infra/database/PgPromiseAdapter';
import ExpressAdapter from './infra/http/ExpressAdapter';
import HttpController from './infra/http/HttpController';
import UseCaseFactory from './infra/factory/UseCaseFactory';
import GatewayHttpFactory from './infra/factory/GatewayHttpFactory';
import AxiosAdapter from './infra/http/AxiosAdapter';

dotenv.config()
const port = Number(process.env.API_PORT) || 3000;

const connection = new PgPromiseAdapter();
connection.connect();
const repositoryFactory = new DatabaseRepositoryFactory(connection);
const httpClient = new AxiosAdapter();
const gatewayFactory = new GatewayHttpFactory(httpClient);
const useCaseFactory = new UseCaseFactory(repositoryFactory, gatewayFactory);
const httpServer = new ExpressAdapter();
new HttpController(httpServer, useCaseFactory);
httpServer.listen(port);