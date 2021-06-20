import { singleton } from 'tsyringe';
import Path from 'path';

export interface IConfiguration {
  Name: string;
  Url: string;
  Version: string;
  DatabasePath: string;
  Debug: boolean;
}

@singleton()
export class Configuration implements IConfiguration
{
  public Name: string;
  public Url: string;
  public Version: string;
  public DatabasePath: string;
  public Debug: boolean;

  constructor()
  {
    this.Name = 'mExport';
    this.Url = 'https://github.com/Ealenn/mExport';
    this.Version = 'SANDBOX';
    this.Debug = false;
    this.DatabasePath = Path.join(__dirname, `${this.Name}.${this.Version}.db`);
  }
}
