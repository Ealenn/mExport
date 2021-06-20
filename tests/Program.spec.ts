import 'reflect-metadata';
import { Mock, It, Times } from 'moq.ts';
import * as Commander from 'commander';
import { IConfiguration } from '../src/Configuration';
import Program from '../src/Program';
import { ICommandsService, ILoggerService, IExitService } from '../src/Services/Abstractions';
import { ICommand } from '../src/Commands/Abstractions';
import { IMailServerRepository } from '../src/Database/Abstractions';

class TestProgram extends Program
{
  public LandingStatus = false;
  public DatabaseStatus = false;
  public CommanderStatus = false;

  protected override async Landing(): Promise<Program>
  {
    this.LandingStatus = true;
    return this;
  }

  protected override async Database(): Promise<Program>
  {
    this.DatabaseStatus = true;
    return this;
  }

  protected override async Commander(): Promise<Program>
  {
    this.CommanderStatus = true;
    return this;
  }
}

describe('Program', function()
{
  let ExitServiceMock : Mock<IExitService>;
  let ConfigurationMock : Mock<IConfiguration>;
  let CommandsServiceMock : Mock<ICommandsService>;
  let MailServerRepositoryMock : Mock<IMailServerRepository>;
  let LoggerServiceMock : Mock<ILoggerService>;

  beforeEach(() =>
  {
    ExitServiceMock = new Mock<IExitService>();
    ConfigurationMock = new Mock<IConfiguration>();
    CommandsServiceMock = new Mock<ICommandsService>();
    LoggerServiceMock = new Mock<ILoggerService>();
    MailServerRepositoryMock = new Mock<IMailServerRepository>();
  });

  it('Run', async function()
  {
    // A
    const CommandMock = new Mock<Commander.Command>();

    // A
    const program = new TestProgram(
      ExitServiceMock.object(),
      ConfigurationMock.object(),
      CommandsServiceMock.object(),
      MailServerRepositoryMock.object(),
      LoggerServiceMock.object()
    );
    await program.Run(CommandMock.object());

    // A
    expect(program.LandingStatus).toBeTruthy();
    expect(program.DatabaseStatus).toBeTruthy();
    expect(program.CommanderStatus).toBeTruthy();
  });

  it('Database', async function()
  {
    // A
    MailServerRepositoryMock
      .setup(x => x.ConnectAsync(It.IsAny<string>(), It.IsAny<boolean>()))
      .returns(new Promise<void>(_ => _()));
    ConfigurationMock.setup(x => x.DatabasePath).returns('pathTest');
    ConfigurationMock.setup(x => x.Debug).returns(true);

    // A
    const program = new Program(
      ExitServiceMock.object(),
      ConfigurationMock.object(),
      CommandsServiceMock.object(),
      MailServerRepositoryMock.object(),
      LoggerServiceMock.object()
    );
    const result = await program['Database']();

    // A
    MailServerRepositoryMock.verify(x => x.ConnectAsync('pathTest', true), Times.Once());
    expect(result).toBe(program);
  });

  it('Landing', async function()
  {
    // A
    LoggerServiceMock.setup(x => x.Ascii(It.IsAny<any>())).returns();
    LoggerServiceMock.setup(x => x.Information(It.IsAny<any>())).returns();
    ConfigurationMock.setup(x => x.Name).returns('TesT');
    ConfigurationMock.setup(x => x.Version).returns('1.42.12');

    // A
    const program = new Program(
      ExitServiceMock.object(),
      ConfigurationMock.object(),
      CommandsServiceMock.object(),
      MailServerRepositoryMock.object(),
      LoggerServiceMock.object()
    );
    await program['Landing']();

    // A
    LoggerServiceMock.verify(x => x.Ascii('TesT'), Times.Once());
    LoggerServiceMock.verify(x => x.Information('Version: 1.42.12'), Times.Once());
  });

  it('Commander', async function()
  {
    // A
    const CommanderMock = new Mock<Commander.Command>();

    ConfigurationMock.setup(x => x.Version).returns('1.42.16');
    CommanderMock.setup(x => x.version(It.IsAny<string>())).returns(CommanderMock.object());
    CommanderMock.setup(x => x.helpOption).returns(() => CommanderMock.object());
    CommanderMock.setup(x => x.parse).returns(() => CommanderMock.object());

    CommanderMock.setup(x => x.command).returns(() => CommanderMock.object());
    CommanderMock.setup(x => x.description(It.IsAny<string>())).returns(CommanderMock.object());
    CommanderMock.setup(x => x.option(It.IsAny<string>())).returns(CommanderMock.object());
    CommanderMock.setup(x => x.action(It.IsAny<Promise<void>>())).returns(CommanderMock.object());

    const CommandsMock = new Array<Mock<ICommand>>(
      new Mock<ICommand>(),
      new Mock<ICommand>(),
      new Mock<ICommand>()
    );
    CommandsServiceMock.setup(x => x.AvailableCommands).returns(() =>
    {
      const result = Array<ICommand>();
      for (let indexMock = 0; indexMock < CommandsMock.length; indexMock++)
      {
        CommandsMock[indexMock].setup(x => x.ActionAsync).returns(async() => { return true; });
        CommandsMock[indexMock].setup(x => x.Command).returns('test');
        CommandsMock[indexMock].setup(x => x.Description).returns('test');
        CommandsMock[indexMock].setup(x => x.Options).returns(new Array<string>(`${(Math.floor(Math.random() * (10000 + 1)))}`));
        result.push(CommandsMock[indexMock].object());
      }
      return result;
    });

    // A
    const program = new Program(
      ExitServiceMock.object(),
      ConfigurationMock.object(),
      CommandsServiceMock.object(),
      MailServerRepositoryMock.object(),
      LoggerServiceMock.object()
    );
    await program['Commander'](CommanderMock.object());

    // A
    CommanderMock.verify(x => x.version('1.42.16'), Times.Once());
    for (let indexMock = 0; indexMock < CommandsMock.length; indexMock++)
    {
      CommandsMock[indexMock].verify(x => x.Command, Times.Once());
      CommandsMock[indexMock].verify(x => x.Description, Times.Once());

      for (let indexMockOptions = 0; indexMockOptions < CommandsMock[indexMock].object().Options.length; indexMockOptions++)
      {
        CommanderMock.verify(x => x.option(CommandsMock[indexMock].object().Options[indexMockOptions]), Times.Once());
      }
    }
  });
});
