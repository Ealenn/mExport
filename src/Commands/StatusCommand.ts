import { inject, injectable } from "tsyringe";
import ICommand from './Abstractions/ICommand';
import { IMailService } from "../Services/Abstractions/IMailService";
import { IMailServerRepository } from "../Database/IMailServerRepository";
import { ILoggerService } from "../Services/Abstractions/ILoggerService";

@injectable()
export default class StatusCommand implements ICommand {
  private _mailService: IMailService;
  private _mailServerRepository: IMailServerRepository;
  private _loggerService: ILoggerService;

  Command: string;
  Description: string;
  Options: string[];

  constructor(
    @inject('IMailService') mailService: IMailService,
    @inject('IMailServerRepository') mailServerRepository: IMailServerRepository,
    @inject('ILoggerService') loggerService: ILoggerService
  ) {
    this.Command = 'status';
    this.Description = 'view status of Mail servers';
    this.Options = new Array<string>();

    this._mailService = mailService;
    this._mailServerRepository = mailServerRepository;
    this._loggerService = loggerService;
  }

  public async ActionAsync(): Promise<boolean> {
    const results = await this._mailServerRepository.FindAllAsync();

    if (results.length == 0) {
      this._loggerService.Error('No Mail server configured');
      return false;
    }

    for (let indexServer = 0; indexServer < results.length; indexServer++) {
      const server = results[indexServer];
      let status : string;
      try {
        await this._mailService.ConnectAsync(server);
        status = 'OK';
      } catch {
        status = 'FAIL';
      }
      this._loggerService.Information(`- ${server.id} | [${status}] ${server.user}`);
    }

    return true;
  }
}
