import DistanceCalculator from "../../domain/entity/DistanceCalculator";
import FreightCalculator from "../../domain/entity/FreightCalculator";
import RepositoryFactory from "../factory/RepositoryFactory";
import ZipCodeRepository from "../repository/ZipCodeRepository";

// Use Case (Clean Arch) or Application Service (DDD)
export default class SimulateFreight {
  zipCodeRepository: ZipCodeRepository;

  constructor(repositoryFactory: RepositoryFactory) {
    this.zipCodeRepository = repositoryFactory.createZipCodeRepository();
  }

  async execute(input: Input): Promise<Output> {
    const output = {
      freight: 0,
    };

    for (const item of input.items) {
      if (input.from && input.to) {
        const from = await this.zipCodeRepository.get(input.from);
        const to = await this.zipCodeRepository.get(input.to);
        let distance = 1000;

        if (from && to) {
          distance = DistanceCalculator.calculate(from.coord, to.coord);
        }
        const freight = FreightCalculator.calculate(distance, item.volume, item.density);

        output.freight += freight * item.quantity;
      }
    }

    return output;
  }
}


type Input = {
  items: {
    volume: number,
    density: number,
    quantity: number,
  }[],
  from?: string,
  to?: string,
}

type Output = {
  freight: number,
}