import { injectable, inject } from 'tsyringe';
import * as Commander from 'commander';
import { IConfiguration } from './Configuration';
import { IExitService, ILoggerService, ICommandsService } from './Services/Abstractions';
import { IMailServerRepository } from './Database/Abstractions';

@injectable()
export default class Program
{
  private _exitService: IExitService;
  private _configuration: IConfiguration;
  private _commandsService: ICommandsService;
  private _mailServerRepository: IMailServerRepository;
  private _loggerService: ILoggerService;

  constructor(
    @inject('IExitService') exitService: IExitService,
    @inject('IConfiguration') configuration: IConfiguration,
    @inject('ICommandsService') commandsService: ICommandsService,
    @inject('IMailServerRepository') mailServerRepository: IMailServerRepository,
    @inject('ILoggerService') loggerService: ILoggerService)
  {
    this._exitService = exitService;
    this._configuration = configuration;
    this._commandsService = commandsService;
    this._mailServerRepository = mailServerRepository;
    this._loggerService = loggerService;
  }

  public async Run(CommanderProgram: Commander.Command) : Promise<void>
  {
    await this.Database();
    await this.Landing();
    await this.Commander(CommanderProgram);
  }

  protected async Landing(): Promise<Program>
  {
    this._loggerService.Ascii(this._configuration.Name);
    this._loggerService.Information(this._configuration.Url);
    this._loggerService.Information(`Version: ${this._configuration.Version}`);
    this._loggerService.Information(`Path: ${this._configuration.DatabasePath}`);
    return this;
  }

  protected async Database(): Promise<Program>
  {
    await this._mailServerRepository.ConnectAsync(this._configuration.DatabasePath, this._configuration.Debug);
    return this;
  }

  protected async Commander(CommanderProgram: Commander.Command): Promise<Program>
  {
    const Commands = this._commandsService.AvailableCommands();

    CommanderProgram.version(this._configuration.Version);
    CommanderProgram.helpOption('-h, --help', 'read more information');

    for (let indexCommand = 0; indexCommand < Commands.length; indexCommand++)
    {
      const command = CommanderProgram
        .command(Commands[indexCommand].Command)
        .description(Commands[indexCommand].Description)
        .action(async(...args) =>
        {
          const result = await Commands[indexCommand].ActionAsync(...args);
          if (!result)
          {
            this._exitService.OnError();
          }
          this._exitService.OnSuccess();
        });

      for (let indexOption = 0; indexOption < Commands[indexCommand].Options.length; indexOption++)
      {
        command.option(Commands[indexCommand].Options[indexOption]);
      }
    }

    CommanderProgram.parse(process.argv);
    return this;
  }
}
