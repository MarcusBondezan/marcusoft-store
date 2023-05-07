import { isBefore } from 'date-fns';

import EmailGateway from './EmailGateway';
import EmailGatewayConsole from './EmailGatewayConsole';
import ProductRepository from './ProductRepository';
import ProductRepositoryDatabase from './ProductRepositoryDatabase';
import CouponRepository from './CouponRepository';
import CouponRepositoryDatabase from './CouponRepositoryDatabase';
import { validate } from './validateCpf';

export default class Checkout {

  constructor(
    readonly productRepository: ProductRepository = new ProductRepositoryDatabase(),
    readonly couponRepository: CouponRepository = new CouponRepositoryDatabase(),
    readonly emailGateway: EmailGateway = new EmailGatewayConsole(),
  ) {}

  async execute(input: Input): Promise<Output> {
    const output = { 
      total: 0,
      subtotal: 0,
      freight: 0,
    };

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

        const product = await this.productRepository.get(item.id);

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
      const coupon = await this.couponRepository.get(input.coupon);
  
      if (!coupon) {
        throw new Error('Cupom de desconto inexistente');
      }
  
      if (isBefore(coupon!.expire_date, Date.now())) {
        throw new Error('Cupom de desconto expirado');
      }
  
      output.total -= (output.total * Number(coupon.percentage)/100);
    }

    output.total += output.freight;

    if (input.email) {
      await this.emailGateway.send(
        'Compra confirmada',
        '...',
        input.email,
        'no-reply@marcusoft.com'
      );
    }
  
    return output;
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
  email?: string,
}

type Output = {
  subtotal: number,
  total: number,
  freight: number,
}