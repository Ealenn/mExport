import { inject, injectable } from 'tsyringe';
import ICommand from '../Commands/Abstractions/ICommand';
import LoginCommand from '../Commands/LoginCommand';
import DisconnectCommand from '../Commands/DisconnectCommand';
import StatusCommand from '../Commands/StatusCommand';
import SynchronizeCommand from '../Commands/SynchronizeCommand';
import { ICommandsService } from './Abstractions/ICommandsService';

/* istanbul ignore file */
@injectable()
export class CommandsService implements ICommandsService
{
  private _loginCommand: LoginCommand;
  private _disconnectCommand: DisconnectCommand;
  private _statusCommand: StatusCommand;
  private _synchronizeCommand: SynchronizeCommand;

  constructor(
    @inject('LoginCommand') loginCommand: LoginCommand,
    @inject('DisconnectCommand') disconnectCommand: DisconnectCommand,
    @inject('StatusCommand') statusCommand: StatusCommand,
    @inject('SynchronizeCommand') synchronizeCommand: SynchronizeCommand
  )
  {
    this._loginCommand = loginCommand;
    this._disconnectCommand = disconnectCommand;
    this._statusCommand = statusCommand;
    this._synchronizeCommand = synchronizeCommand;
  }

  public AvailableCommands(): Array<ICommand>
  {
    const Commands = new Array<ICommand>();

    Commands.push(this._loginCommand);
    Commands.push(this._disconnectCommand);
    Commands.push(this._statusCommand);
    Commands.push(this._synchronizeCommand);

    return Commands;
  }
}
