import { Email, MailServer } from './Entities';
import { ILoggerService } from '../Services/Abstractions/ILoggerService';
import { inject, singleton } from 'tsyringe';
import { Connection, createConnection, EntityManager } from 'typeorm';
import { getManager } from 'typeorm';
import { IMailServerRepository } from './Abstractions/IMailServerRepository';
import { DomainStats } from './Models';
import _ from 'lodash';

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
        __dirname + '/Entities/*.js',
        __dirname + '/Entities/*.ts'
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

  /**
   * STATS
   */
  public async StatsDomain(): Promise<DomainStats[]>
  {
    let result = new Array<DomainStats>();
    const servers = await this.FindAllAsync();
    for (let serverCursor = 0; serverCursor < servers.length; serverCursor++)
    {
      const queryResult = await MailServerRepository._manager.query(`SELECT "from_domain" as "Host", "to" as "On", COUNT(*) AS "Count" FROM "email" WHERE "serverId" = "${servers[serverCursor].id}" GROUP BY "Host" ORDER BY "Count" DESC;`);
      const stats = queryResult as DomainStats[];
      result = _.concat(result, stats);
    }
    return result;
  }
}
