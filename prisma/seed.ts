import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  
  const products = await prisma.product.createMany({
    data: [
      { description: 'A', price: 1000 },
      { description: 'B', price: 5000 },
      { description: 'C', price: 30 },
    ]
  });

  const coupon = await prisma.coupon.create({
    data: {
      code: 'VALE20', 
      percentage: 20
    }
  });

  console.log({ products, coupon });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  });