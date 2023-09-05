import Coord from "../../src/domain/entity/Coord";
import DistanceCalculator from "../../src/domain/entity/DistanceCalculator";

test('Deve calcular a distância entre duas coordenadas', function() {
  const coordA = new Coord(-27.5945, -48.5477);
  const coordB = new Coord(-22.9219, -43.2003);
  const distance = DistanceCalculator.calculate(coordA, coordB);
  expect(distance).toBe(747.5122571381046);
});