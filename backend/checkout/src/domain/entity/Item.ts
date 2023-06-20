export default class Item {
  constructor(
    readonly idProduct: number,
    readonly price: number,
    readonly quantity: number,
  ) {
    if (quantity <= 0) {
      throw new Error('Quantidade inválida');
    }
  }

  getTotal(): number {
    return this.price * this.quantity;
  }
}