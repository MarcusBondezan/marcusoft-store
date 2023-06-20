export default class Product {
  constructor(
    readonly id: number,
    readonly description: string,
    readonly price: number,
    readonly width: number,
    readonly height: number,
    readonly length: number,
    readonly weight: number
  ){
    if (this.width <= 0 || this.height <= 0 || this.length <= 0) {
      throw new Error('Dimensões inválidas');
    }
    if (this.weight <= 0) {
      throw new Error('Peso inválido');
    }
  }

  getVolume(): number {
    return this.height/100 * this.width/100 * this.length/100;
  }

  getDensity(): number {
    return this.weight/this.getVolume();
  }
}