import { isBefore } from 'date-fns';
import { PrismaClient } from '@prisma/client'

import { validate } from './validateCpf';

export default class Checkout {
  async execute(input: Input): Promise<Output> {
    const output = { 
      total: 0,
      subtotal: 0,
      freight: 0,
    };

    const prisma = new PrismaClient();

    try {
      const isValidCpf = validate(input.cpf);
    
      if (!isValidCpf) {
        throw new Error('CPF inválido');
      }
  
      if (input.items) {
    
        for (const item of input.items) {
          if (item.quantity <= 0) {
            throw new Error('Quantidade inválida');
          }
  
          if (input.items.filter((product:any) => product.id === item.id).length > 1) {
            throw new Error('Produto duplicado');
          }
    
          const product = await prisma.product.findUnique({ where: { id: item.id }});
  
          if(!product) {
            throw new Error('Produto não existente');
          }
  
          const productPrice = !!product ? Number(product.price) : 0;
          output.subtotal += productPrice * item.quantity;
  
          if (input.from && input.to) {
            const volume = product.height/100 * product.width/100 * product.length/100;
            const density = Number(product.weight)/volume;
            let freight = volume * 1000 * (density/100);
            freight = Math.max(10, freight);
            output.freight += freight * item.quantity;
          }
        }
      }
  
      output.total = output.subtotal;
    
      if (input.coupon) {
        const coupon = await prisma.coupon.findUnique({ where: { code: input.coupon }});
    
        if (!coupon) {
          throw new Error('Cupom de desconto inexistente');
        }
    
        if (isBefore(coupon!.expire_date, Date.now())) {
          throw new Error('Cupom de desconto expirado');
        }
    
        output.total -= (output.total * Number(coupon.percentage)/100);
      }
  
      output.total += output.freight;
    
      return output;
    } finally {
      await prisma.$disconnect();
    }
  }
}

type Input = {
  cpf: string,
  items: {
    id: number,
    quantity: number,
  }[],
  coupon?: string,
  from?: string,
  to?: string,
}

type Output = {
  subtotal: number,
  total: number,
  freight: number,
}