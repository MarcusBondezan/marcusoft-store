import Coord from "./Coord";

// Entity - has identity (code) - Aggregate Root
export default class ZipCode {
  coord: Coord;

  constructor(readonly code: string, readonly lat: number, readonly long: number) {
    this.coord = new Coord(lat, long);
  }
} 