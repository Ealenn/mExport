import { IHandlebarsService, ILoggerService } from './Abstractions';
import * as fs from 'fs';
import * as path from 'path';
import Handlebars from 'handlebars';
import { injectable, inject } from 'tsyringe';
import _ from 'lodash';
import { ContextStats } from '../Database/Models';

/* istanbul ignore file */
@injectable()
export class HandlebarsService implements IHandlebarsService
{
  private _loggerService: ILoggerService;
  private _handlebars: typeof Handlebars;

  constructor(
    @inject('ILoggerService') loggerService: ILoggerService
  )
  {
    this._loggerService = loggerService;
    this._handlebars = Handlebars.create();
    this._initialiseHandlebars();
  }

  public async SaveFileAsync(folderPath: string, context: ContextStats): Promise<void>
  {
    this._loggerService.Information('Dashboard initialization...');
    const filePath = path.join(folderPath, 'index.html');
    const Template = this._handlebars.compile(this._getTemplate());
    fs.writeFileSync(filePath, Template(context));
  }

  private _initialiseHandlebars()
  {
    const pathToHandlebarsPartialsFolder = path.join(__dirname, '../www/partials');
    const partialsFilesList = fs.readdirSync(pathToHandlebarsPartialsFolder);
    partialsFilesList.forEach(partialFileName =>
    {
      if (_.endsWith(partialFileName, 'partial.hbs'))
      {
        const pathToPartialFile = path.join(pathToHandlebarsPartialsFolder, partialFileName);
        const partialName = partialFileName.replace('.partial.hbs', '');
        const content = fs.readFileSync(pathToPartialFile).toString();
        this._handlebars.registerPartial(partialName, content);
        this._loggerService.Debug(`${pathToPartialFile} loaded`);
      }
    });
  }

  private _getTemplate(): string
  {
    const pathToHandlebarsTemplate = path.join(__dirname, '../www/index.hbs');
    return fs.readFileSync(pathToHandlebarsTemplate).toString();
  }
}
