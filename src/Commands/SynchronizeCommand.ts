import { inject, injectable } from 'tsyringe';
import { ICommand } from './Abstractions';
import { IMailService, ILoggerService } from '../Services/Abstractions';
import { IMailServerRepository } from '../Database/Abstractions';
import { ImapSimple } from 'imap-simple';

@injectable()
export class SynchronizeCommand implements ICommand
{
  private _batchSize = 10;
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
  )
  {
    this.Command = 'synchronize';
    this.Description = 'download all emails from Mail servers';
    this.Options = new Array<string>(
      '-b, --batch [batch]'
    );

    this._mailService = mailService;
    this._mailServerRepository = mailServerRepository;
    this._loggerService = loggerService;
  }

  public async ActionAsync(request: any): Promise<boolean>
  {
    const { batch } = request;
    if (batch != undefined && batch >= 1 && batch <= 200)
    {
      this._batchSize = Number(batch);
    }

    const servers = await this._mailServerRepository.FindAllAsync();
    if (servers.length == 0)
    {
      this._loggerService.Error('No Mail server configured');
      return false;
    }

    for (let indexServer = 0; indexServer < servers.length; indexServer++)
    {
      const server = servers[indexServer];
      let imap : ImapSimple;

      // Connect
      this._loggerService.Information(`Connect to ${server.server} for ${server.user}...`);
      try
      {
        imap = await this._mailService.ConnectAsync(server);
      }
      catch
      {
        this._loggerService.Error(`Unable to connect to ${server.server}. Invalid credentials or server parameters.`);
        continue;
      }

      // Purge
      this._loggerService.Information('[In Progress] Purge local old data...');
      const deletedEmails = await this._mailServerRepository.PurgeEmailsAsync(server);
      this._loggerService.Information(`[OK] ${deletedEmails} email(s) removed from local storage !`);

      // Count
      this._loggerService.Information(`[In Progress] Counting emails for ${server.user} in ${server.server}...`);
      const count = await this._mailService.CountAsync(imap);
      this._loggerService.Information(`[OK] ${count} email in boxes !`);

      // Download
      this._loggerService.Information(`[Download] Counting emails for ${server.user} in ${server.server}`);

      let downloaded = 0;
      while (downloaded < count)
      {
        const toDownload = (count - downloaded) < this._batchSize ? (count - downloaded) : this._batchSize;
        const mails = await this._mailService.DownloadAsync(imap, downloaded, toDownload);

        for (let indexMails = 0; indexMails < mails.length; indexMails++)
        {
          const email = await this._mailService.GetEmailAsync(mails[indexMails], server);
          if (email != null)
          {
            await this._mailServerRepository.SaveEmailAsync(email);
          }
        }

        downloaded += toDownload;
        this._loggerService.Information(`Download ... ${Math.floor((downloaded / count) * 100)}% (${downloaded}/${count})`);
      }
    }

    this._loggerService.Information('Synchronization completed !');
    return true;
  }
}
