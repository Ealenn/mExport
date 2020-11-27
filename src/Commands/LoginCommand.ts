import { inject, injectable } from "tsyringe";
import ICommand from './Abstractions/ICommand';
import { ISMTPServer, SMTPServer } from '../Database/Models/SMTPServer';
import { IQuestionService } from "../Services/Abstractions/IQuestionService";
import { ISMTPService } from "../Services/Abstractions/ISMTPService";
import { ILoggerService } from "../Services/Abstractions/ILoggerService";
import { SMTPServerRepository } from "../Database/SMTPServerRepository";

@injectable()
export default class LoginCommand implements ICommand {
  private _smtpServerRepository: SMTPServerRepository;
  private _questionService: IQuestionService;
  private _smtpService: ISMTPService;
  private _loggerService: ILoggerService;

  Command: string;
  Description: string;
  Options: string[];

  constructor(
    @inject('SMTPServerRepository') smtpServerRepository: SMTPServerRepository,
    @inject('IQuestionService') questionService: IQuestionService,
    @inject('ISMTPService') smtpService: ISMTPService,
    @inject('ILoggerService') loggerService: ILoggerService
  ) {
    this.Command = 'login';
    this.Description = 'login to SMTP server';
    this.Options = new Array<string>(
      '-u, --user [user]',
      '-p, --password [password]',
      '-s, --server [server]',
      '-i, --port [port]',
      '--secure'
    );

    this._smtpServerRepository = smtpServerRepository;
    this._questionService = questionService;
    this._smtpService = smtpService;
    this._loggerService = loggerService;
  }

  public async Action(request: any): Promise<Boolean> {
    const {
      user,
      password,
      server,
      port,
      secure
    } = request;

    let account: ISMTPServer = {
      id: 0,
      user: user ?? await this._questionService.Ask('text', 'What is your SMTP User ?'),
      password: password ?? await this._questionService.Ask('password', 'What is your SMTP Password ?'),
      server: server ?? await this._questionService.Ask('text', 'What is your SMTP Server ?'),
      port: port ?? await this._questionService.Ask('number', 'What is your SMTP Port ?'),
      secure: secure ?? await this._questionService.Ask('toggle', 'This connection is secure ?'),
    };

    if (await this._smtpService.CheckAccount(account)) {
      await this._smtpServerRepository.Save(account);
      this._loggerService.Information(`Account ${account.user} added.`);
      return true;
    }

    this._loggerService.Error(`Unable to connect to ${account.server} server. Invalid credentials ou Server parameters.`);
    return false;
  }
}
