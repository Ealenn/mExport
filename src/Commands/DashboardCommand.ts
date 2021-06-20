import { inject, injectable } from 'tsyringe';
import { ICommand } from './Abstractions';
import { ILoggerService } from '../Services/Abstractions/ILoggerService';
import { IQuestionService } from '../Services/Abstractions/IQuestionService';
import * as fs from 'fs';
import { IDashboardService } from '../Services/Abstractions/IDashboardService';

@injectable()
export class DashboardCommand implements ICommand
{
  private _dashboardService: IDashboardService;
  private _questionService: IQuestionService;
  private _loggerService: ILoggerService;

  Command: string;
  Description: string;
  Options: string[];

  constructor(
    @inject('IDashboardService') dashboardService: IDashboardService,
    @inject('IQuestionService') questionService: IQuestionService,
    @inject('ILoggerService') loggerService: ILoggerService
  )
  {
    this.Command = 'dashboard';
    this.Description = 'export dashboard';
    this.Options = new Array<string>(
      '-p, --path [path]'
    );

    this._dashboardService = dashboardService;
    this._questionService = questionService;
    this._loggerService = loggerService;
  }

  public async ActionAsync(request: any): Promise<boolean>
  {
    const pathToDashboard = request.path ?? await this._questionService
      .AskAsync('text', 'Where do you want export the dashboard ?');

    try
    {
      const pathStat = fs.statSync(pathToDashboard);
      if (!pathStat.isDirectory())
        throw new Error();
    }
    catch
    {
      this._loggerService.Error('Invalid folder path.');
      return false;
    }

    this._loggerService.Information(`Export Dashboard on ${pathToDashboard}`);
    return await this._dashboardService.GenerateAsync(pathToDashboard);
  }
}
