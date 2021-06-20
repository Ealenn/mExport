import { ICommand } from '../../Commands/Abstractions';

export interface ICommandsService {
  AvailableCommands(): Array<ICommand>;
}
