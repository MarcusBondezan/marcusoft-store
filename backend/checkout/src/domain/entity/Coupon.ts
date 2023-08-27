import { isAfter } from "date-fns";

// DDD - Entity
export default class Coupon {
  constructor(
    readonly code: string,
    readonly percentage: number,
    readonly expireDate: Date,
  ) {}

  isValid(today: Date): boolean {
    return isAfter(this.expireDate, today);
  }

  calculateDiscount(amount: number): number {
    return amount * this.percentage / 100;
  }
}