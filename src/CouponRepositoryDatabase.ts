import { prisma } from './prisma-client';
import CouponRepository from './CouponRepository';

export default class CouponRepositoryDatabase implements CouponRepository {
  async get (code: string): Promise<any> {
    return prisma.coupon.findUnique({ where: { code }});
  }
}