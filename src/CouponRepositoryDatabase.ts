import CouponRepository from './CouponRepository';
import Coupon from './Coupon';
import DatabaseConnection from './DabaseConnection';

export default class CouponRepositoryDatabase implements CouponRepository {

  constructor(readonly connection: DatabaseConnection) {}

  async get (code: string): Promise<Coupon | null> {
    const [couponData] = await this.connection.query('select * from coupon where code = $1', [code]);

    if (!couponData) return null;
    
    return new Coupon(
      couponData.code,
      Number(couponData.percentage),
      couponData.expire_date,
    );
  }
}