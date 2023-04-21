import * as dotenv from 'dotenv'
import express from 'express';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

dotenv.config()

const app = express();
const port = process.env.API_PORT;

app.get('/products', async (req, res) => {
  const products = await prisma.product.findMany();
  console.log(products)
  res.send({products});

  await prisma.$disconnect()

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});