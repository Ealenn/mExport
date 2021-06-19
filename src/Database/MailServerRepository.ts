import { MailServer } from './Models/MailServer';
import { Email } from './Models/Email';
import { ILoggerService } from '../Services/Abstractions/ILoggerService';
import { inject, singleton } from 'tsyringe';
import { Connection, createConnection, EntityManager } from 'typeorm';
import { getManager } from 'typeorm';
import { IMailServerRepository } from './IMailServerRepository';

/* istanbul ignore file */
@singleton()
export class MailServerRepository implements IMailServerRepository
{
  static _connection: Connection;
  static _manager: EntityManager;
  private _loggerService: ILoggerService;

  constructor(
    @inject('ILoggerService') loggerService: ILoggerService
  )
  {
    this._loggerService = loggerService;
  }

  public async ConnectAsync(database: string, logging: boolean): Promise<void>
  {
    MailServerRepository._connection = await createConnection({
      type: 'sqlite',
      database: database,
      synchronize: true,
      entities: [
        __dirname + '/Models/*.js'
      ],
      logging: logging ? 'all' : undefined
    });
    MailServerRepository._manager = getManager();
  }

  public async SaveAsync(mailServer: MailServer): Promise<MailServer>
  {
    return MailServerRepository._manager.save(mailServer);
  }

  public async FindAsync(filter: any): Promise<MailServer|undefined>
  {
    return MailServerRepository._connection.getRepository(MailServer).findOne({
      where: filter
    });
  }

  public async FindAllAsync(): Promise<Array<MailServer>>
  {
    return MailServerRepository._connection.getRepository(MailServer).find();
  }

  public async RemoveAsync(mailServer: MailServer): Promise<void>
  {
    await MailServerRepository._connection.getRepository(MailServer).delete(mailServer);
  }

  public SaveEmailAsync(email : Email): Promise<Email>
  {
    return MailServerRepository._manager.save(email);
  }

  public async PurgeEmailsAsync(mailServer: MailServer): Promise<number>
  {
    const result = await MailServerRepository._manager.delete(Email, {
      server: mailServer
    });
    return result.affected || 0;
  }
}
