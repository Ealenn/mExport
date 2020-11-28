import "reflect-metadata"

import { Mock, It, Times, ExpectedGetPropertyExpression } from 'moq.ts';

import DisconnectCommand from "../../src/Commands/DisconnectCommand";
import { ILoggerService } from '../../src/Services/Abstractions/ILoggerService';
import { MailServerRepository } from "../../src/Database/MailServerRepository";

describe('Commands/DisconnectCommand', function () {

  let MailServerRepositoryMock: Mock<MailServerRepository>;
  let LoggerServiceMock: Mock<ILoggerService>;

  beforeEach(() => {
    MailServerRepositoryMock = new Mock<MailServerRepository>();
    LoggerServiceMock = new Mock<ILoggerService>();

    LoggerServiceMock.setup(x => x.Error).returns(() => {});
    LoggerServiceMock.setup(x => x.Information).returns(() => {});
  });

  it('With ID', async function () {
    // A
    MailServerRepositoryMock.setup(x => x.Remove).returns(async () => 1);

    // A
    const command = new DisconnectCommand(MailServerRepositoryMock.object(), LoggerServiceMock.object());
    const result = await command.Action(<any> {
        id: 1
    });

    // A
    LoggerServiceMock.verify(x => x.Information, Times.AtLeastOnce());
    LoggerServiceMock.verify(x => x.Error, Times.Never());
    MailServerRepositoryMock.verify(x => x.Remove, Times.Once());
    expect(result).toBeTruthy();
  });

  it('With User', async function () {
    // A
    MailServerRepositoryMock.setup(x => x.Remove).returns(async () => 1);

    // A
    const command = new DisconnectCommand(MailServerRepositoryMock.object(), LoggerServiceMock.object());
    const result = await command.Action(<any> {
        user: 'example@example.com'
    });

    // A
    LoggerServiceMock.verify(x => x.Information, Times.AtLeastOnce());
    LoggerServiceMock.verify(x => x.Error, Times.Never());
    MailServerRepositoryMock.verify(x => x.Remove, Times.Once());
    expect(result).toBeTruthy();
  });

  it('Without options', async function () {
    // A

    // A
    const command = new DisconnectCommand(MailServerRepositoryMock.object(), LoggerServiceMock.object());
    const result = await command.Action(<any> {});

    // A
    LoggerServiceMock.verify(x => x.Error, Times.AtLeastOnce());
    MailServerRepositoryMock.verify(x => x.Remove, Times.Never());
    expect(result).toBeFalsy();
  });
});
