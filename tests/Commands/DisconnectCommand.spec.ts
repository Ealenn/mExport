import 'reflect-metadata';
import { Mock, Times } from 'moq.ts';
import DisconnectCommand from '../../src/Commands/DisconnectCommand';
import { ILoggerService } from '../../src/Services/Abstractions/ILoggerService';
import { IMailServerRepository } from '../../src/Database/IMailServerRepository';
import { MailServer } from '../../src/Database/Models/MailServer';

describe('Commands/DisconnectCommand', function()
{

  let MailServerRepositoryMock: Mock<IMailServerRepository>;
  let LoggerServiceMock: Mock<ILoggerService>;

  beforeEach(() =>
  {
    MailServerRepositoryMock = new Mock<IMailServerRepository>();
    LoggerServiceMock = new Mock<ILoggerService>();

    LoggerServiceMock.setup(x => x.Error).returns(() => {});
    LoggerServiceMock.setup(x => x.Information).returns(() => {});
  });

  it('With ID', async function()
  {
    // A
    MailServerRepositoryMock.setup(x => x.RemoveAsync).returns(async() => {});
    MailServerRepositoryMock.setup(x => x.FindAsync).returns(async() => new MailServer());

    // A
    const command = new DisconnectCommand(MailServerRepositoryMock.object(), LoggerServiceMock.object());
    const result = await command.ActionAsync(<any> {
      id: 1
    });

    // A
    LoggerServiceMock.verify(x => x.Information, Times.AtLeastOnce());
    LoggerServiceMock.verify(x => x.Error, Times.Never());
    MailServerRepositoryMock.verify(x => x.RemoveAsync, Times.Once());
    expect(result).toBeTruthy();
  });

  it('With User', async function()
  {
    // A
    MailServerRepositoryMock.setup(x => x.FindAsync).returns(async() => new MailServer());
    MailServerRepositoryMock.setup(x => x.RemoveAsync).returns(async() => {});

    // A
    const command = new DisconnectCommand(MailServerRepositoryMock.object(), LoggerServiceMock.object());
    const result = await command.ActionAsync(<any> {
      user: 'example@example.com'
    });

    // A
    LoggerServiceMock.verify(x => x.Information, Times.AtLeastOnce());
    LoggerServiceMock.verify(x => x.Error, Times.Never());
    MailServerRepositoryMock.verify(x => x.RemoveAsync, Times.Once());
    expect(result).toBeTruthy();
  });

  it('Without options', async function()
  {
    // A

    // A
    const command = new DisconnectCommand(MailServerRepositoryMock.object(), LoggerServiceMock.object());
    const result = await command.ActionAsync(<any> {});

    // A
    LoggerServiceMock.verify(x => x.Error, Times.AtLeastOnce());
    MailServerRepositoryMock.verify(x => x.RemoveAsync, Times.Never());
    expect(result).toBeFalsy();
  });
});
