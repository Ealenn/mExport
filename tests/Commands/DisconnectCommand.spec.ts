import "reflect-metadata"

import { Mock, It, Times, ExpectedGetPropertyExpression } from 'moq.ts';

import DisconnectCommand from "../../src/Commands/DisconnectCommand";
import { ILoggerService } from '../../src/Services/Abstractions/ILoggerService';
import { SMTPServerRepository } from "../../src/Database/SMTPServerRepository";

describe('Commands/DisconnectCommand', function () {

  let SmtpServerRepositoryMock: Mock<SMTPServerRepository>;
  let LoggerServiceMock: Mock<ILoggerService>;

  beforeEach(() => {
    SmtpServerRepositoryMock = new Mock<SMTPServerRepository>();
    LoggerServiceMock = new Mock<ILoggerService>();

    LoggerServiceMock.setup(x => x.Error).returns(() => {});
    LoggerServiceMock.setup(x => x.Information).returns(() => {});
  });

  it('With ID', async function () {
    // A
    SmtpServerRepositoryMock.setup(x => x.Remove).returns(async () => 1);

    // A
    const command = new DisconnectCommand(SmtpServerRepositoryMock.object(), LoggerServiceMock.object());
    const result = await command.Action(<any> {
        id: 1
    });

    // A
    LoggerServiceMock.verify(x => x.Information, Times.AtLeastOnce());
    LoggerServiceMock.verify(x => x.Error, Times.Never());
    SmtpServerRepositoryMock.verify(x => x.Remove, Times.Once());
    expect(result).toBeTruthy();
  });

  it('With User', async function () {
    // A
    SmtpServerRepositoryMock.setup(x => x.Remove).returns(async () => 1);

    // A
    const command = new DisconnectCommand(SmtpServerRepositoryMock.object(), LoggerServiceMock.object());
    const result = await command.Action(<any> {
        user: 'example@example.com'
    });

    // A
    LoggerServiceMock.verify(x => x.Information, Times.AtLeastOnce());
    LoggerServiceMock.verify(x => x.Error, Times.Never());
    SmtpServerRepositoryMock.verify(x => x.Remove, Times.Once());
    expect(result).toBeTruthy();
  });

  it('Without options', async function () {
    // A

    // A
    const command = new DisconnectCommand(SmtpServerRepositoryMock.object(), LoggerServiceMock.object());
    const result = await command.Action(<any> {});

    // A
    LoggerServiceMock.verify(x => x.Error, Times.AtLeastOnce());
    SmtpServerRepositoryMock.verify(x => x.Remove, Times.Never());
    expect(result).toBeFalsy();
  });
});
