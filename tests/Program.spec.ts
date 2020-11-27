import "reflect-metadata"

import { Mock, It, Times, ExpectedGetPropertyExpression } from 'moq.ts';

import * as Commander from 'commander';
import { IConfiguration } from "../src/Configuration";
import Program from "../src/Program";
import { ISequelizeFactory } from "../src/Factory/Abstractions/ISequelizeFactory";
import { ICommandsService } from "../src/Services/Abstractions/ICommandsService";
import { ILoggerService } from "../src/Services/Abstractions/ILoggerService";
import ICommand from "../src/Commands/Abstractions/ICommand";

describe('Program', function () {
  let ConfigurationMock : Mock<IConfiguration>;
  let SequelizeFactoryMock : Mock<ISequelizeFactory>;
  let CommandsServiceMock : Mock<ICommandsService>;
  let LoggerServiceMock : Mock<ILoggerService>;

  beforeEach(() => {
    ConfigurationMock = new Mock<IConfiguration>();
    SequelizeFactoryMock = new Mock<ISequelizeFactory>();
    CommandsServiceMock = new Mock<ICommandsService>();
    LoggerServiceMock = new Mock<ILoggerService>();
  });

  it('Landing', async function () {
    // A;
    LoggerServiceMock.setup(x => x.Ascii(It.IsAny<any>())).returns();
    LoggerServiceMock.setup(x => x.Information(It.IsAny<any>())).returns();
    ConfigurationMock.setup(x => x.Name).returns("TesT");
    ConfigurationMock.setup(x => x.Version).returns("1.42.12");

    // A
    let program = new Program(
      SequelizeFactoryMock.object(),
      ConfigurationMock.object(),
      CommandsServiceMock.object(),
      LoggerServiceMock.object());
    await program.Landing();

    // A
    LoggerServiceMock.verify(x => x.Ascii("TesT"), Times.Once());
    LoggerServiceMock.verify(x => x.Information("Version: 1.42.12"), Times.Once());
  });

  it('Sequelize', async function () {
    // A
    SequelizeFactoryMock.setup(x => x.Init).returns(async () => true);

    // A
    let program = new Program(
      SequelizeFactoryMock.object(),
      ConfigurationMock.object(),
      CommandsServiceMock.object(),
      LoggerServiceMock.object());
    await program.Sequelize();

    // A
    SequelizeFactoryMock.verify(x => x.Init, Times.Once());
  });

  it('Commander', async function () {
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
    CommandsServiceMock.setup(x => x.AvailableCommands).returns(() => {
      const result = Array<ICommand>();
      for (let indexMock = 0; indexMock < CommandsMock.length; indexMock++)
      {
        CommandsMock[indexMock].setup(x => x.Action).returns(async () => { return true });
        CommandsMock[indexMock].setup(x => x.Command).returns('test');
        CommandsMock[indexMock].setup(x => x.Description).returns('test');
        CommandsMock[indexMock].setup(x => x.Options).returns(new Array<string>(`${(Math.floor(Math.random() * (10000 + 1)))}`));
        result.push(CommandsMock[indexMock].object());
      }
      return result;
    });

    // A
    let program = new Program(
      SequelizeFactoryMock.object(),
      ConfigurationMock.object(),
      CommandsServiceMock.object(),
      LoggerServiceMock.object());
    await program.Commander(CommanderMock.object());

    // A
    CommanderMock.verify(x => x.version('1.42.16'), Times.Once());
    for (let indexMock = 0; indexMock < CommandsMock.length; indexMock++)
    {
      CommandsMock[indexMock].verify(x => x.Command, Times.Once());
      CommandsMock[indexMock].verify(x => x.Description, Times.Once());

      for (let indexMockOptions = 0; indexMockOptions < CommandsMock[indexMock].object().Options.length; indexMockOptions++){
        CommanderMock.verify(x => x.option(CommandsMock[indexMock].object().Options[indexMockOptions]), Times.Once());
      }
    }
  });
});
