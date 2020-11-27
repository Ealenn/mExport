import { injectable, inject } from "tsyringe";
import * as Commander from 'commander';
import { IConfiguration } from './Configuration';
import { ICommandsService } from "./Services/Abstractions/ICommandsService";
import { ISequelizeFactory } from './Factory/Abstractions/ISequelizeFactory';
import { ILoggerService } from "./Services/Abstractions/ILoggerService";

@injectable()
export default class Program {
  private _sequelizeFactory: ISequelizeFactory;
  private _configuration: IConfiguration;
  private _commandsService: ICommandsService;
  private _loggerService: ILoggerService;

  constructor(
    @inject("ISequelizeFactory") sequelizeFactory: ISequelizeFactory,
    @inject("IConfiguration") configuration: IConfiguration,
    @inject("ICommandsService") commandsService: ICommandsService,
    @inject("ILoggerService") loggerService: ILoggerService) {
    this._sequelizeFactory = sequelizeFactory;
    this._configuration = configuration;
    this._commandsService = commandsService;
    this._loggerService = loggerService;
  }

  public async Sequelize(): Promise<Program> {
    await this._sequelizeFactory.Init();
    return this;
  }

  public async Landing(): Promise<Program> {
    this._loggerService.Ascii(this._configuration.Name);
    this._loggerService.Information(`Version: ${this._configuration.Version}`);
    this._loggerService.Information(`Path: ${this._configuration.DatabasePath}`);
    return this;
  }

  public async Commander(CommanderProgram: Commander.Command): Promise<Program> {
    const Commands = this._commandsService.AvailableCommands();

    CommanderProgram.version(this._configuration.Version);
    CommanderProgram.helpOption('-h, --help', 'read more information');

    for (let indexCommand = 0; indexCommand < Commands.length; indexCommand++) {
      const command = CommanderProgram
        .command(Commands[indexCommand].Command)
        .description(Commands[indexCommand].Description)
        .action((...args) => {
          Commands[indexCommand].Action(...args);
        });

      for (let indexOption = 0; indexOption < Commands[indexCommand].Options.length; indexOption++) {
        command.option(Commands[indexCommand].Options[indexOption]);
      }
    }

    CommanderProgram.parse(process.argv);
    return this;
  }
}
