import { inject, injectable } from "tsyringe";
import ICommand from './Abstractions/ICommand';
import { IMailService } from "../Services/Abstractions/IMailService";
import { MailServerRepository } from "../Database/MailServerRepository";
import { ILoggerService } from "../Services/Abstractions/ILoggerService";

@injectable()
export default class StatusCommand implements ICommand {
  private _mailService: IMailService;
  private _mailServerRepository: MailServerRepository;
  private _loggerService: ILoggerService;

  Command: string;
  Description: string;
  Options: string[];

  constructor(
    @inject('IMailService') mailService: IMailService,
    @inject('MailServerRepository') mailServerRepository: MailServerRepository,
    @inject('ILoggerService') loggerService: ILoggerService
  ) {
    this.Command = 'status';
    this.Description = 'view status of Mail servers';
    this.Options = new Array<string>();

    this._mailService = mailService;
    this._mailServerRepository = mailServerRepository;
    this._loggerService = loggerService;
  }

  public async Action(...args: any[]): Promise<Boolean> {
    let results = await this._mailServerRepository.FindAll();

    if (results.length == 0) {
      this._loggerService.Error('No Mail server configured');
      return true;
    }

    for (let indexServer = 0; indexServer < results.length; indexServer++) {
      const server = results[indexServer];
      let status : string;
      try {
        await this._mailService.Connect(server);
        status = 'OK';
      } catch {
        status = 'FAIL';
      }
      this._loggerService.Information(`- ${server.id} | [${status}] ${server.user}`);
    }

    return true;
  }
}
