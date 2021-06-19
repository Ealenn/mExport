import ICommand from '../../Commands/Abstractions/ICommand';

export interface ICommandsService {
  AvailableCommands(): Array<ICommand>;
}
