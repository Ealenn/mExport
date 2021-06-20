import { injectable, inject } from 'tsyringe';
import { IConfiguration } from '../Configuration';
import { IStatsRepository } from '../Database/Abstractions';
import { ContextStats } from '../Database/Models';
import { IDashboardService, IHandlebarsService, ILoggerService } from './Abstractions';

@injectable()
export class DashboardService implements IDashboardService
{
  private _handlebarsService: IHandlebarsService;
  private _statsRepository: IStatsRepository;
  private _configuration: IConfiguration;
  private _loggerService: ILoggerService;

  constructor(
    @inject('IHandlebarsService') handlebarsService: IHandlebarsService,
    @inject('IStatsRepository') statsRepository: IStatsRepository,
    @inject('IConfiguration') configuration: IConfiguration,
    @inject('ILoggerService') loggerService: ILoggerService
  )
  {
    this._handlebarsService = handlebarsService;
    this._statsRepository = statsRepository;
    this._configuration = configuration;
    this._loggerService = loggerService;
  }

  public async GenerateAsync(path: string): Promise<boolean>
  {
    const context = {
      Configuration: this._configuration,
      Domains: await this._statsRepository.DomainAsync()
    } as ContextStats;
    await this._handlebarsService.SaveFileAsync(path, context);
    this._loggerService.Information(`[DONE] The dashboard is available here ${path}`);
    return true;
  }
}
