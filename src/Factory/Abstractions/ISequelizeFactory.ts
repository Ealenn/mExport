import { Sequelize } from "sequelize";

export interface ISequelizeFactory {
  Init(): Promise<boolean>;
  Sequelize: Sequelize;
}
