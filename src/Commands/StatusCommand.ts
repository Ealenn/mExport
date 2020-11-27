import { inject, injectable } from "tsyringe";
import ICommand from './Abstractions/ICommand';
import { ISMTPService } from "../Services/Abstractions/ISMTPService";
import { SMTPServerRepository } from "../Database/SMTPServerRepository";
import { ILoggerService } from "../Services/Abstractions/ILoggerService";

@injectable()
export default class StatusCommand implements ICommand {
  private _smtpService: ISMTPService;
  private _smtpServerRepository: SMTPServerRepository;
  private _loggerService: ILoggerService;

  Command: string;
  Description: string;
  Options: string[];

  constructor(
    @inject('ISMTPService') smtpService: ISMTPService,
    @inject('SMTPServerRepository') smtpServerRepository: SMTPServerRepository,
    @inject('ILoggerService') loggerService: ILoggerService
  ) {
    this.Command = 'status';
    this.Description = 'view status of SMTP servers';
    this.Options = new Array<string>();

    this._smtpService = smtpService;
    this._smtpServerRepository = smtpServerRepository;
    this._loggerService = loggerService;
  }

  public async Action(...args: any[]): Promise<Boolean> {
    let results = await this._smtpServerRepository.FindAll();

    if (results.length == 0) {
      this._loggerService.Error('No SMTP server configured');
      return true;
    }

    for (let indexServer = 0; indexServer < results.length; indexServer++) {
      const server = results[indexServer];
      const connected = await this._smtpService.CheckAccount(server);
      this._loggerService.Information(`- [${server.id}]`, server.user, ` |  Connected : ${connected}`);
    }

    return true;
  }
}
