import * as dotenv from 'dotenv'
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'
import { isBefore } from 'date-fns';

import { validate } from './validateCpf';

const prisma = new PrismaClient();

dotenv.config()

const app = express();
app.use(express.json());


app.post('/checkout', async function (req: Request, res: Response) {
  try {
    const input = req.body;
    const isValidCpf = validate(input.cpf);
  
    if (!isValidCpf) {
      return res.json({ message: 'CPF inválido' });
    }
  
    const output = { 
      total: 0,
      subtotal: 0,
      freight: 0,
    };
    const productsInput = req.body.products;
    const couponCodeInput = req.body.couponCode;

    if (productsInput) {
  
      for (const productInput of productsInput) {
        if (productInput.quantity <= 0) {
          throw new Error('Quantidade inválida');
        }

        if (productsInput.filter((product:any) => product.id === productInput.id).length > 1) {
          throw new Error('Produto duplicado');
        }
  
        const product = await prisma.product.findUnique({ where: { id: productInput.id }});

        if(!product) {
          throw new Error('Produto não existente');
        }

        const productPrice = !!product ? Number(product.price) : 0;
        output.subtotal += productPrice * productInput.quantity;

        if (req.body.from && req.body.to) {
          const volume = product.height/100 * product.width/100 * product.length/100;
          const density = Number(product.weight)/volume;
          let freight = volume * 1000 * (density/100);
          freight = Math.max(10, freight);
          output.freight += freight * productInput.quantity;
        }
      }
    }

    output.total = output.subtotal;
  
    if (couponCodeInput) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCodeInput }});
  
      if (!coupon) {
        return res.json({ message: 'Cupom de desconto inexistente' });
      }
  
      if (isBefore(coupon!.expire_date, Date.now())) {
        return res.json({ message: 'Cupom de desconto expirado' });
      }
  
      output.total -= (output.total * Number(coupon.percentage)/100);
    }

    output.total += output.freight;
  
    return res.send(output);  
  } catch(e: any) {
    res.status(422).json({
      message: e.message
    });
  } finally {
    await prisma.$disconnect();
  }
});

const port = process.env.API_PORT;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});