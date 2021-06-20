import { ImapSimple, connect as ImapConnect, Message } from 'imap-simple';
import { IConfiguration } from '../Configuration';
import { inject, injectable } from 'tsyringe';
import { ILoggerService, IMailService } from './Abstractions';
import _ from 'lodash';
import { simpleParser } from 'mailparser';
import { Email, MailServer } from '../Database/Entities';

/* istanbul ignore file */
@injectable()
export class MailService implements IMailService
{
  private _configuration: IConfiguration;
  private _loggerService: ILoggerService;

  constructor(
    @inject('IConfiguration') configuration: IConfiguration,
    @inject('ILoggerService') loggerService: ILoggerService
  )
  {
    this._configuration = configuration;
    this._loggerService = loggerService;
  }

  public async DownloadAsync(server: ImapSimple, skip: number, take: number): Promise<Message[]>
  {
    try
    {
      const searchPattern = `${skip + 1}:${skip + take}`;
      const emails = await server.search([searchPattern], {
        bodies: [''],
        markSeen: false
      });
      this._loggerService.Debug(`Download from IMAP: [${searchPattern}] | Skip: ${skip} Take: ${take} Receive: ${emails.length}`);
      return emails;
    }
    catch (exception)
    {
      this._loggerService.Debug(exception);
      return new Array<Message>();
    }
  }

  public async CountAsync(server: ImapSimple): Promise<number>
  {
    await server.openBox('INBOX');
    const emails = await server.search(['ALL'], {
      bodies: [],
      markSeen: false
    });
    return emails.length;
  }

  public async GetEmailAsync(message: Message, server: MailServer): Promise<Email | null>
  {
    try
    {
      const all = _.find(message.parts, { 'which': '' });
      const idHeader = 'Imap-Id: ' + message.attributes.uid + '\r\n';

      const result = await simpleParser(idHeader+all?.body, {
        decodeStrings: true,
        encoding: 'utf-8'
      });

      const email = new Email();

      email.server = server;
      email.from = result.from?.value[0].address as string;
      email.from_domain = email.from.split('@')[1];
      email.to = server.user;
      email.subject = result.subject as string || 'empty';
      email.content_html = result.html as string || 'empty';
      email.content_text = result.text as string || 'empty';

      return email;
    }
    catch (exception)
    {
      this._loggerService.Debug(exception);
      return null;
    }
  }

  public async ConnectAsync(server: MailServer): Promise<ImapSimple>
  {
    const imap = await ImapConnect({
      imap: {
        user: server.user,
        password: server.password,
        host: server.server,
        port: server.port,
        tls: server.secure,
        autotls: server.secure ? 'required' : 'never',
        authTimeout: 3000,
        keepalive: true,
        debug: this._configuration.Debug ? console.log : undefined
      }
    });
    await imap.getBoxes();
    await imap.openBox('INBOX');
    return imap;
  }
}
