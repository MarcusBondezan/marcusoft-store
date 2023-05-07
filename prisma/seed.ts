import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  
  const products = await prisma.product.createMany({
    data: [
      { 
        id: 1, 
        description: 'A', 
        price: 1000,
        width: 100,
        height: 30,
        length: 10,
        weight: 3
      },
      { 
        id: 2, 
        description: 'B', 
        price: 5000,
        width: 50,
        height: 50,
        length: 50,
        weight: 22
      },
      { 
        id: 3, 
        description: 'C', 
        price: 30,
        width: 10,
        height: 10,
        length: 10,
        weight: 0.9
      },
    ]
  });

  const coupon = await prisma.coupon.createMany({
    data: [
      {
        code: 'VALE20', 
        percentage: 20,
        expire_date: new Date('2023-10-01T10:00:00')
      },
      {
        code: 'VALE10', 
        percentage: 10,
        expire_date: new Date('2022-10-01T10:00:00')
      }
    ]
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