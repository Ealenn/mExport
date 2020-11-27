import { singleton } from "tsyringe";
import Path from 'path';

@singleton()
export class Configuration implements IConfiguration {
  public Name: string;
  public Version: string;
  public DatabasePath: string;
  public Debug: boolean;

  constructor() {
    this.Name = 'mExport';
    this.Version = 'SANDBOX';
    this.DatabasePath = Path.join(__dirname, `${this.Name}.db`);
    this.Debug = false;
  }
}

export interface IConfiguration {
  Name: string;
  Version: string;
  DatabasePath: string;
  Debug: boolean;
}
