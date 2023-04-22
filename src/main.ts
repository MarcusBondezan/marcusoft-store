import * as dotenv from 'dotenv'
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'

import { validate } from './validateCpf';

const prisma = new PrismaClient();

dotenv.config()

const app = express();
app.use(express.json());


app.post('/checkout', async function (req: Request, res: Response) {
  const input = req.body;
  const isValidCpf = validate(input.cpf);

  if (!isValidCpf) {
    res.json({
      message: 'CPF inválido'
    });
  } else {
    const output = { total: 0 };
    const productsInput = req.body.products;

    for (const productInput of productsInput) {
      const product = await prisma.product.findUnique({ where: { id: productInput.id }});
      const productPrice = !!product ? Number(product.price) : 0;
      output.total += productPrice * productInput.quantity;
    }

    if (req.body.couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: req.body.couponCode }});

      if (coupon) {
        output.total -= (output.total * Number(coupon.percentage)/100);
      }
    }

    res.send(output);
    await prisma.$disconnect()
  }
});

const port = process.env.API_PORT;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});