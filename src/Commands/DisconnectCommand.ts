import { inject, injectable } from "tsyringe";
import ICommand from './Abstractions/ICommand';
import { MailServerRepository } from "../Database/MailServerRepository";
import { ILoggerService } from "../Services/Abstractions/ILoggerService";

@injectable()
export default class DisconnectCommand implements ICommand {
  private _mailServerRepository: MailServerRepository;
  private _loggerService: ILoggerService;

  Command: string;
  Description: string;
  Options: string[];

  constructor(
    @inject('MailServerRepository') mailServerRepository: MailServerRepository,
    @inject('ILoggerService') loggerService: ILoggerService
  ) {
    this.Command = 'disconnect';
    this.Description = 'remove Mail server';
    this.Options = new Array<string>(
      '-i, --id [id]',
      '-u, --user [user]'
    );

    this._mailServerRepository = mailServerRepository;
    this._loggerService = loggerService;
  }

  public async Action(request: any): Promise<Boolean> {
    const {
      id,
      user
    } = request;

    let operation: number;

    if (id) {
      operation = await this._mailServerRepository.Remove({ id: id });
    } else if (user) {
      operation = await this._mailServerRepository.Remove({ user: user });
    } else {
      this._loggerService.Error('Missing required argument');
      return false;
    }

    this._loggerService.Information(`${operation} account(s) disconnected`);
    return true;
  }
}
