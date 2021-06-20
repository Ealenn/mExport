import 'reflect-metadata';
import { Mock, It, Times } from 'moq.ts';
import { SynchronizeCommand } from '../../src/Commands';
import { MailServer } from '../../src/Database/Entities/MailServer';
import { IMailService } from '../../src/Services/Abstractions/IMailService';
import { ILoggerService } from '../../src/Services/Abstractions/ILoggerService';
import { IMailServerRepository } from '../../src/Database/IMailServerRepository';
import { ImapSimple, Message } from 'imap-simple';
import { Email } from '../../src/Database/Entities/Email';

describe('Commands/SynchronizeCommand', function()
{

  let MailServiceMock: Mock<IMailService>;
  let MailServerRepositoryMock: Mock<IMailServerRepository>;
  let LoggerServiceMock: Mock<ILoggerService>;

  beforeEach(() =>
  {
    MailServiceMock = new Mock<IMailService>();
    MailServerRepositoryMock = new Mock<IMailServerRepository>();
    LoggerServiceMock = new Mock<ILoggerService>();

    LoggerServiceMock.setup(x => x.Error).returns(() => {});
    LoggerServiceMock.setup(x => x.Information).returns(() => {});
  });

  it('No server', async function()
  {
    // A
    MailServerRepositoryMock.setup(x => x.FindAllAsync).returns(async() => new Array<MailServer>());

    // A
    const command = new SynchronizeCommand(MailServiceMock.object(), MailServerRepositoryMock.object(), LoggerServiceMock.object());
    const result = await command.ActionAsync(<any>{});

    // A
    LoggerServiceMock.verify(x => x.Error, Times.AtLeastOnce());
    expect(result).toBeFalsy();
  });

  it('Invalid Server, but continue', async function()
  {
    // A
    const ServerExample = <MailServer>{
      id: 1,
      user: 'example',
      password: 'example',
      server: 'nsa',
      port: 21,
      secure: false
    };
    MailServerRepositoryMock.setup(x => x.FindAllAsync).returns(async() => new Array<MailServer>(ServerExample));
    MailServiceMock.setup(x => x.ConnectAsync(It.IsAny<MailServer>())).throws('');

    // A
    const command = new SynchronizeCommand(MailServiceMock.object(), MailServerRepositoryMock.object(), LoggerServiceMock.object());
    const result = await command.ActionAsync(<any>{});

    // A
    LoggerServiceMock.verify(x => x.Error, Times.AtLeastOnce());
    expect(result).toBeTruthy();
  });

  it('Valid server with batch', async function()
  {
    // A
    const ImapMock = new Mock<ImapSimple>();
    const ServerExample = new MailServer();
    ServerExample.id = 1;
    ServerExample.user = 'example';
    ServerExample.password = 'example';
    ServerExample.server = 'nsa';
    ServerExample.port = 21;
    ServerExample.secure = false;

    MailServerRepositoryMock.setup(x => x.FindAllAsync).returns(async() => new Array<MailServer>(ServerExample));
    MailServiceMock.setup(x => x.ConnectAsync(ServerExample)).returns(new Promise(_ => _(ImapMock.object())));
    MailServerRepositoryMock.setup(x => x.PurgeEmailsAsync(ServerExample)).returns(new Promise(_ => _(42)));
    MailServiceMock.setup(x => x.CountAsync(It.IsAny<ImapSimple>())).returns(new Promise<number>(_ => _(3)));
    MailServiceMock.setup(x => x.DownloadAsync(It.IsAny<ImapSimple>(), It.IsAny<number>(), It.IsAny<number>()))
      .returns(new Promise(_ => _(new Array<Message>(
        new Mock<Message>().object()
      ))));
    MailServiceMock.setup(x => x.GetEmailAsync(It.IsAny(), It.IsAny())).returns(new Promise(_ => _(<Email>{})));
    MailServerRepositoryMock.setup(x => x.SaveEmailAsync(It.IsAny<Email>())).returns(new Promise(_ => _(new Email())));

    // A
    const command = new SynchronizeCommand(MailServiceMock.object(), MailServerRepositoryMock.object(), LoggerServiceMock.object());
    const result = await command.ActionAsync(<any>{
      batch: '1'
    });

    // A
    MailServiceMock.verify(x => x.ConnectAsync(ServerExample), Times.Once());
    MailServerRepositoryMock.verify(x => x.PurgeEmailsAsync(ServerExample), Times.Once());
    MailServiceMock.verify(x => x.CountAsync(It.IsAny()), Times.Once());
    MailServiceMock.verify(x => x.DownloadAsync(It.IsAny(), It.IsAny(), It.IsAny()), Times.Exactly(3));
    MailServiceMock.verify(x => x.GetEmailAsync(It.IsAny(), It.IsAny()), Times.Exactly(3));
    MailServerRepositoryMock.verify(x => x.SaveEmailAsync(It.IsAny<Email>()), Times.Exactly(3));
    expect(result).toBeTruthy();
  });
});
