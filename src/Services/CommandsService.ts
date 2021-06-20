import { injectable } from 'tsyringe';
import * as Commands from '../Commands';
import { ICommand } from '../Commands/Abstractions';
import { ICommandsService } from './Abstractions';
import { container } from 'tsyringe';

@injectable()
export class CommandsService implements ICommandsService
{
  public AvailableCommands(): Array<ICommand>
  {
    const result = new Array<ICommand>();
    Object.keys(Commands).forEach(commandName =>
    {
      result.push(container.resolve(commandName));
    });
    return result;
  }
}
