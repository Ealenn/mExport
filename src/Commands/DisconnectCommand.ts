import { inject, injectable } from "tsyringe";
import ICommand from './Abstractions/ICommand';
import { SMTPServerRepository } from "../Database/SMTPServerRepository";
import { ILoggerService } from "../Services/Abstractions/ILoggerService";

@injectable()
export default class DisconnectCommand implements ICommand {
  private _smtpServerRepository: SMTPServerRepository;
  private _loggerService: ILoggerService;

  Command: string;
  Description: string;
  Options: string[];

  constructor(
    @inject('SMTPServerRepository') smtpServerRepository: SMTPServerRepository,
    @inject('ILoggerService') loggerService: ILoggerService
  ) {
    this.Command = 'disconnect';
    this.Description = 'remove SMTP server';
    this.Options = new Array<string>(
      '-i, --id [id]',
      '-u, --user [user]'
    );

    this._smtpServerRepository = smtpServerRepository;
    this._loggerService = loggerService;
  }

  public async Action(request: any): Promise<Boolean> {
    const {
      id,
      user
    } = request;

    let operation: number;

    if (id) {
      operation = await this._smtpServerRepository.Remove({ id: id });
    } else if (user) {
      operation = await this._smtpServerRepository.Remove({ user: user });
    } else {
      this._loggerService.Error('Missing required argument');
      return false;
    }

    this._loggerService.Information(`${operation} account(s) disconnected`);
    return true;
  }
}
