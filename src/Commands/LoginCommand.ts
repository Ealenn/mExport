import { inject, injectable } from "tsyringe";
import ICommand from './Abstractions/ICommand';
import { MailServer } from '../Database/Models/MailServer';
import { IQuestionService } from "../Services/Abstractions/IQuestionService";
import { IMailService } from "../Services/Abstractions/IMailService";
import { ILoggerService } from "../Services/Abstractions/ILoggerService";
import { IMailServerRepository } from "../Database/IMailServerRepository";

@injectable()
export default class LoginCommand implements ICommand {
  private _mailServerRepository: IMailServerRepository;
  private _questionService: IQuestionService;
  private _mailService: IMailService;
  private _loggerService: ILoggerService;

  Command: string;
  Description: string;
  Options: string[];

  constructor(
    @inject('IMailServerRepository') mailServerRepository: IMailServerRepository,
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

  public async ActionAsync(request: any): Promise<boolean> {
    const {
      user,
      password,
      server,
      port,
      secure
    } = request;

    const account = new MailServer();
    account.user = user ?? await this._questionService.AskAsync('text', 'What is your Mail User ?');
    account.password = password ?? await this._questionService.AskAsync('password', 'What is your Mail Password ?');
    account.server = server ?? await this._questionService.AskAsync('text', 'What is your Mail Server ?');
    account.port = port ?? await this._questionService.AskAsync('number', 'What is your Mail Port ?');
    account.secure = secure ?? await this._questionService.AskAsync('toggle', 'This connection is secure ?');

    try {
      await this._mailService.ConnectAsync(account);
      await this._mailServerRepository.SaveAsync(account);
      this._loggerService.Information(`Account ${account.user} added.`);
      return true;
    } catch(exception) {
      this._loggerService.Debug(exception);
      this._loggerService.Error(`Unable to connect to ${account.server} server. Invalid credentials or server parameters.`);
      return false;
    }
  }
}
