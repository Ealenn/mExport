import { inject, injectable } from "tsyringe";
import ICommand from "../Commands/Abstractions/ICommand";
import LoginCommand from "../Commands/LoginCommand";
import DisconnectCommand from "../Commands/DisconnectCommand";
import StatusCommand from "../Commands/StatusCommand";
import { ICommandsService } from "./Abstractions/ICommandsService";

@injectable()
export class CommandsService implements ICommandsService {
  private _loginCommand: LoginCommand;
  private _disconnectCommand: DisconnectCommand;
  private _statusCommand: StatusCommand;

  constructor(
    @inject('LoginCommand') loginCommand: LoginCommand,
    @inject('DisconnectCommand') disconnectCommand: DisconnectCommand,
    @inject('StatusCommand') statusCommand: StatusCommand
  ) {
    this._loginCommand = loginCommand;
    this._disconnectCommand = disconnectCommand;
    this._statusCommand = statusCommand;
  }

  public AvailableCommands(): Array<ICommand> {
    const Commands = new Array<ICommand>();

    Commands.push(this._loginCommand);
    Commands.push(this._disconnectCommand);
    Commands.push(this._statusCommand);

    return Commands;
  }
}
