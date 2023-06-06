import * as dotenv from 'dotenv'
import express, { Request, Response } from 'express';

import Checkout from './Checkout';
import DatabaseRepositoryFactory from './DatabaseRepositoryFactory';
import PgPromiseAdapter from './PgPromiseAdapter';

dotenv.config()

const app = express();
app.use(express.json());

const connection = new PgPromiseAdapter();
connection.connect();
const repositoryFactory = new DatabaseRepositoryFactory(connection);

app.post('/checkout', async function (req: Request, res: Response) {
  try {
    const checkout = new Checkout(repositoryFactory);
    const output = await checkout.execute(req.body);
    res.json(output);
  } catch(e: any) {
    res.status(422).json({
      message: e.message,
    });
  }
});

const port = process.env.API_PORT;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});