import 'reflect-metadata';
import { Mock, It, Times } from 'moq.ts';
import { StatusCommand } from '../../src/Commands';
import { MailServer } from '../../src/Database/Entities';
import { IMailService, ILoggerService } from '../../src/Services/Abstractions';
import { IMailServerRepository } from '../../src/Database/Abstractions';
import { ImapSimple } from 'imap-simple';

describe('Commands/StatusCommand', function()
{

  let MailServiceMock: Mock<IMailService>;
  let MailServerRepositoryMock: Mock<IMailServerRepository>;
  let LoggerServiceMock: Mock<ILoggerService>;

  let ImapSimpleMock : Mock<ImapSimple>;

  beforeEach(() =>
  {
    MailServiceMock = new Mock<IMailService>();
    MailServerRepositoryMock = new Mock<IMailServerRepository>();
    LoggerServiceMock = new Mock<ILoggerService>();
    ImapSimpleMock = new Mock<ImapSimple>();

    LoggerServiceMock.setup(x => x.Error).returns(() => {});
    LoggerServiceMock.setup(x => x.Information).returns(() => {});
  });

  it('Without Servers', async function()
  {
    // A
    MailServerRepositoryMock.setup(x => x.FindAllAsync).returns(async() => new Array<MailServer>());

    // A
    const command = new StatusCommand(MailServiceMock.object(), MailServerRepositoryMock.object(), LoggerServiceMock.object());
    const result = await command.ActionAsync();

    // A
    LoggerServiceMock.verify(x => x.Error, Times.Once());
    expect(result).toBeFalsy();
  });

  it('With Servers', async function()
  {
    // A
    MailServerRepositoryMock.setup(x => x.FindAllAsync).returns(async() => new Array<MailServer>(
        <MailServer>{
          id: 1,
          user: 'example',
          password: 'example',
          server: 'smtp.example.com',
          port: 25,
          secure: true
        }
    ));
    MailServiceMock.setup(x => x.ConnectAsync(It.IsAny<MailServer>())).returns(new Promise((_) => _(<ImapSimple | PromiseLike<ImapSimple>>ImapSimpleMock.object())));

    // A
    const command = new StatusCommand(MailServiceMock.object(), MailServerRepositoryMock.object(), LoggerServiceMock.object());
    const result = await command.ActionAsync();

    // A
    LoggerServiceMock.verify(x => x.Error, Times.Never());
    LoggerServiceMock.verify(x => x.Information, Times.AtLeastOnce());
    MailServiceMock.verify(x => x.ConnectAsync, Times.Once());
    expect(result).toBeTruthy();
  });

  it('With Servers Fail', async function()
  {
    // A
    MailServerRepositoryMock.setup(x => x.FindAllAsync).returns(async() => new Array<MailServer>(
      <MailServer>{
        id: 1,
        user: 'example',
        password: 'example',
        server: 'smtp.example.com',
        port: 25,
        secure: true
      }
    ));
    MailServiceMock.setup(x => x.ConnectAsync(It.IsAny<MailServer>())).throws('');

    // A
    const command = new StatusCommand(MailServiceMock.object(), MailServerRepositoryMock.object(), LoggerServiceMock.object());
    const result = await command.ActionAsync();

    // A
    LoggerServiceMock.verify(x => x.Error, Times.Never());
    LoggerServiceMock.verify(x => x.Information, Times.AtLeastOnce());
    MailServiceMock.verify(x => x.ConnectAsync, Times.Once());
    expect(result).toBeTruthy();
  });
});
