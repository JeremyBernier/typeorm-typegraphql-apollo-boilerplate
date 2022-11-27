import { AppDataSource } from "../data-source";

export const createDbConnection = async () => {
  return AppDataSource.initialize();
};
