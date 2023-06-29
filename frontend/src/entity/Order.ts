import Item from './Item';
import Product from './Product';

export default class Order {
  items: Item[];
  private total = 0;

  constructor(readonly idOrder: string, readonly cpf: string){
    this.items = [];
  }

  addItem(product: Product) {
    const existingItem = this.items.find((item: any) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.items.push({ id: product.id, quantity: 1 });
    }
    this.total += product.price;
  }

  getTotal() {
    return this.total;
  }
}