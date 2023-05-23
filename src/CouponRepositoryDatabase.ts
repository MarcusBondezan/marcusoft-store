import { prisma } from './prisma-client';
import CouponRepository from './CouponRepository';
import Coupon from './Coupon';

export default class CouponRepositoryDatabase implements CouponRepository {
  async get (code: string): Promise<Coupon | null> {
    const prismaCoupon = await prisma.coupon.findUnique({ where: { code }});

    if (!prismaCoupon) return null;

    return new Coupon(
      prismaCoupon.code,
      Number(prismaCoupon.percentage),
      prismaCoupon.expire_date,
    );
  }
}