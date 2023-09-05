import ZipCodeRepository from "../repository/ZipCodeRepository";

export default interface RepositoryFactory {
  createZipCodeRepository(): ZipCodeRepository;
}