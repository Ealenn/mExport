import { ILoggerService } from '../Services/Abstractions';
import { inject, singleton } from 'tsyringe';
import { DomainStats } from './Models';
import { IStatsRepository } from './Abstractions';
import { MailServerRepository } from './MailServerRepository';

/* istanbul ignore file */
@singleton()
export class StatsRepository implements IStatsRepository
{
  private _loggerService: ILoggerService;

  constructor(
    @inject('ILoggerService') loggerService: ILoggerService
  )
  {
    this._loggerService = loggerService;
  }

  public async DomainAsync(): Promise<DomainStats[]>
  {
    this._loggerService.Information('Generate Domain Stats...');
    const queryResult = await MailServerRepository._manager.query('SELECT "from_domain" as "Host", "to" as "On", COUNT(*) AS "Count" FROM "email" GROUP BY "Host" ORDER BY "Count" DESC;');
    return queryResult as DomainStats[];
  }
}
