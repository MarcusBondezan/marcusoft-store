import CouponRepository from '../../application/repository/CouponRepository';
import Coupon from '../../domain/entity/Coupon';
import DatabaseConnection from '../database/DabaseConnection';

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