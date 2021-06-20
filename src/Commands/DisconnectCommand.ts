import { inject, injectable } from 'tsyringe';
import { ICommand } from './Abstractions';
import { ILoggerService } from '../Services/Abstractions/ILoggerService';
import { IMailServerRepository } from '../Database/Abstractions/IMailServerRepository';

@injectable()
export class DisconnectCommand implements ICommand
{
  private _mailServerRepository: IMailServerRepository;
  private _loggerService: ILoggerService;

  Command: string;
  Description: string;
  Options: string[];

  constructor(
    @inject('IMailServerRepository') mailServerRepository: IMailServerRepository,
    @inject('ILoggerService') loggerService: ILoggerService
  )
  {
    this.Command = 'disconnect';
    this.Description = 'remove Mail server';
    this.Options = new Array<string>(
      '-i, --id [id]',
      '-u, --user [user]'
    );

    this._mailServerRepository = mailServerRepository;
    this._loggerService = loggerService;
  }

  public async ActionAsync(request: any): Promise<boolean>
  {
    const {
      id,
      user
    } = request;

    if (id)
    {
      const server = await this._mailServerRepository.FindAsync({ id: id });
      if (server)
      {
        await this._mailServerRepository.RemoveAsync(server);
        this._loggerService.Information(`${server.user} account(s) disconnected`);
      }
    }
    else if (user)
    {
      const server = await this._mailServerRepository.FindAsync({ user });
      if (server)
      {
        await this._mailServerRepository.RemoveAsync(server);
        this._loggerService.Information(`${server.user} account(s) disconnected`);
      }
    }
    else
    {
      this._loggerService.Error('Missing required argument');
      return false;
    }

    return true;
  }
}
