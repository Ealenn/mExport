import { Sequelize } from "sequelize";
import { singleton, inject } from "tsyringe";
import { IConfiguration } from "../Configuration";

import { initializeModel as SMTPServerInit } from '../Database/Models/SMTPServer';
import { ISequelizeFactory } from "./Abstractions/ISequelizeFactory";

@singleton()
export class SequelizeFactory implements ISequelizeFactory {
  private _configuration: IConfiguration;
  private _sequelize: Sequelize;

  constructor(
    @inject('IConfiguration') configuration: IConfiguration
  ) {
    this._configuration = configuration;
    this._sequelize = new Sequelize({
      database: this._configuration.Name,
      dialect: "sqlite",
      storage: this._configuration.DatabasePath,
      logging: this._configuration.Debug ? console.log : false
    });
  }

  public async Init(): Promise<boolean> {
    await SMTPServerInit(this._sequelize);
    return true;
  }

  get Sequelize(): Sequelize {
    return this._sequelize;
  }
}
