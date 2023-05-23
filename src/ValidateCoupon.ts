import { isAfter } from "date-fns";
import CouponRepository from "./CouponRepository";

export default class ValidateCoupon {
  constructor(readonly couponRepository: CouponRepository) {}

  async execute(code: string): Promise<Output> {
    const output = {
      isValid: false
    };

    const coupon = await this.couponRepository.get(code);

    const today = new Date();

    output.isValid = !!coupon && coupon.isValid(today);

    return output;
  }
}

type Output = {
  isValid: boolean
}