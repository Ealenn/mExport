import { inject, injectable } from "tsyringe";
import ICommand from './Abstractions/ICommand';
import { IMailServer, MailServer } from '../Database/Models/MailServer';
import { IQuestionService } from "../Services/Abstractions/IQuestionService";
import { IMailService } from "../Services/Abstractions/IMailService";
import { ILoggerService } from "../Services/Abstractions/ILoggerService";
import { MailServerRepository } from "../Database/MailServerRepository";

@injectable()
export default class LoginCommand implements ICommand {
  private _mailServerRepository: MailServerRepository;
  private _questionService: IQuestionService;
  private _mailService: IMailService;
  private _loggerService: ILoggerService;

  Command: string;
  Description: string;
  Options: string[];

  constructor(
    @inject('MailServerRepository') mailServerRepository: MailServerRepository,
    @inject('IQuestionService') questionService: IQuestionService,
    @inject('IMailService') mailService: IMailService,
    @inject('ILoggerService') loggerService: ILoggerService
  ) {
    this.Command = 'login';
    this.Description = 'login to Mail server';
    this.Options = new Array<string>(
      '-u, --user [user]',
      '-p, --password [password]',
      '-s, --server [server]',
      '-i, --port [port]',
      '--secure'
    );

    this._mailServerRepository = mailServerRepository;
    this._questionService = questionService;
    this._mailService = mailService;
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

    let account: IMailServer = {
      id: 0,
      user: user ?? await this._questionService.Ask('text', 'What is your Mail User ?'),
      password: password ?? await this._questionService.Ask('password', 'What is your Mail Password ?'),
      server: server ?? await this._questionService.Ask('text', 'What is your Mail Server ?'),
      port: port ?? await this._questionService.Ask('number', 'What is your Mail Port ?'),
      secure: secure ?? await this._questionService.Ask('toggle', 'This connection is secure ?'),
    };

    try {
      await this._mailService.Connect(account);
      await this._mailServerRepository.Save(account);
      this._loggerService.Information(`Account ${account.user} added.`);
      return true;
    } catch {
      this._loggerService.Error(`Unable to connect to ${account.server} server. Invalid credentials or server parameters.`);
      return false;
    }
  }
}
