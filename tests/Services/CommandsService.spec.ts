import 'reflect-metadata';
import { CommandsService } from '../../src/Services';
import * as tsyringe from 'tsyringe';
import { ICommand } from '../../src/Commands/Abstractions';

class TestCommand implements ICommand
{
  Command = 'test';
  Description: 'unit test command';
  Options: string[];
  async ActionAsync(): Promise<boolean>
  {
    return true;
  }
}

describe('Services/CommandsService', function()
{
  it('Available Commands', async function()
  {
    // A
    const availableCommands = [
      'DashboardCommand',
      'DisconnectCommand',
      'LoginCommand',
      'StatusCommand',
      'SynchronizeCommand'
    ];
    availableCommands.forEach(availableCommand =>
    {
      tsyringe.container.register(availableCommand, TestCommand);
    });

    // A
    const commandsService = new CommandsService();
    const result = commandsService.AvailableCommands();

    // A
    expect(result.length).toBe(5);
  });
});
