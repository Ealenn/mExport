import { IConfiguration } from "../Configuration";
import { ILoggerService } from "./Abstractions/ILoggerService";
import chalk from 'chalk';
import figlet from 'figlet';
import { injectable, inject } from "tsyringe";

/* istanbul ignore file */
@injectable()
export class LoggerService implements ILoggerService {
  private _configuration: IConfiguration;

  constructor(
    @inject('IConfiguration') configuration: IConfiguration
  ) {
    this._configuration = configuration;
  }

  Ascii(write: any): void {
    console.log(
      chalk.green(figlet.textSync(write))
    );
    chalk.reset();
  }

  Information(...write: any[]): void {
    write.forEach((text) => {
      console.log(text);
    });
  }

  Debug(...write: any[]): void {
    if (this._configuration.Debug == true) {
      write.forEach((text) => {
        console.log(chalk.grey('[DEBUG]', text));
      });
    }
    chalk.reset();
  }

  Error(...write: any[]): void {
    write.forEach((text) => {
      console.log(chalk.red.bold('[ERROR]', text));
    });
    chalk.reset();
  }
}
