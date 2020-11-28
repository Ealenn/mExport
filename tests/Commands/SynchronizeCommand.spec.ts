import "reflect-metadata"

import { Mock, It, Times, ExpectedGetPropertyExpression } from 'moq.ts';

import SynchronizeCommand from "../../src/Commands/SynchronizeCommand";
import { IMailServer, MailServer } from "../../src/Database/Models/MailServer";
import { IMailService } from '../../src/Services/Abstractions/IMailService';
import { ILoggerService } from '../../src/Services/Abstractions/ILoggerService';
import { MailServerRepository } from "../../src/Database/MailServerRepository";
import { ImapSimple, Message } from "imap-simple";
import { IEmail } from "../../src/Database/Models/Email";

describe('Commands/SynchronizeCommand', function () {

  let MailServiceMock: Mock<IMailService>;
  let MailServerRepositoryMock: Mock<MailServerRepository>;
  let LoggerServiceMock: Mock<ILoggerService>;

  beforeEach(() => {
    MailServiceMock = new Mock<IMailService>();
    MailServerRepositoryMock = new Mock<MailServerRepository>();
    LoggerServiceMock = new Mock<ILoggerService>();

    LoggerServiceMock.setup(x => x.Error).returns(() => {});
    LoggerServiceMock.setup(x => x.Information).returns(() => {});
  });

  it('No server', async function () {
    // A;
    MailServerRepositoryMock.setup(x => x.FindAll).returns(async () => new Array<IMailServer>());

    // A
    const command = new SynchronizeCommand(MailServiceMock.object(), MailServerRepositoryMock.object(), LoggerServiceMock.object());
    const result = await command.Action(<any>{});

    // A
    LoggerServiceMock.verify(x => x.Error, Times.AtLeastOnce());
    expect(result).toBeFalsy();
  });

  it('Invalid Server, but continue', async function () {
    // A;
    const ServerExample = <IMailServer>{
      id: 1,
      user: 'example',
      password: 'example',
      server: 'nsa',
      port: 21,
      secure: false
    };
    MailServerRepositoryMock.setup(x => x.FindAll).returns(async () => new Array<IMailServer>(ServerExample));
    MailServiceMock.setup(x => x.Connect(It.IsAny<IMailServer>())).throws('');

    // A
    const command = new SynchronizeCommand(MailServiceMock.object(), MailServerRepositoryMock.object(), LoggerServiceMock.object());
    const result = await command.Action(<any>{});

    // A
    LoggerServiceMock.verify(x => x.Error, Times.AtLeastOnce());
    expect(result).toBeTruthy();
  });

  it('Valid server with batch', async function () {
    // A;
    const ImapMock = new Mock<ImapSimple>();
    const ServerExample = <IMailServer>{
      id: 1,
      user: 'example',
      password: 'example',
      server: 'nsa',
      port: 21,
      secure: false
    };
    MailServerRepositoryMock.setup(x => x.FindAll).returns(async () => new Array<IMailServer>(ServerExample));
    MailServiceMock.setup(x => x.Connect(It.IsAny<IMailServer>())).returns(new Promise(_ => _(ImapMock.object())));
    MailServerRepositoryMock.setup(x => x.PurgeEmails(ServerExample)).returns(new Promise(_ => _(42)));
    MailServiceMock.setup(x => x.Count(It.IsAny<ImapSimple>())).returns(new Promise<number>(_ => _(3)));
    MailServiceMock.setup(x => x.Download(It.IsAny<ImapSimple>(), It.IsAny<number>(), It.IsAny<number>()))
      .returns(new Promise(_ => _(new Array<Message>(
        new Mock<Message>().object()
      ))));
    MailServiceMock.setup(x => x.GetEmail(It.IsAny(), It.IsAny())).returns(new Promise(_ => _(<IEmail>{})));
    MailServerRepositoryMock.setup(x => x.SaveEmail(It.IsAny<IEmail>())).returns(new Promise(_ => _(true)));

    // A
    const command = new SynchronizeCommand(MailServiceMock.object(), MailServerRepositoryMock.object(), LoggerServiceMock.object());
    const result = await command.Action(<any>{
      batch: '1'
    });

    // A
    MailServiceMock.verify(x => x.Connect(ServerExample), Times.Once());
    MailServerRepositoryMock.verify(x => x.PurgeEmails(ServerExample), Times.Once());
    MailServiceMock.verify(x => x.Count(It.IsAny()), Times.Once());
    MailServiceMock.verify(x => x.Download(It.IsAny(), It.IsAny(), It.IsAny()), Times.Exactly(3));
    MailServiceMock.verify(x => x.GetEmail(It.IsAny(), It.IsAny()), Times.Exactly(3));
    MailServerRepositoryMock.verify(x => x.SaveEmail(It.IsAny<IEmail>()), Times.Exactly(3));
    expect(result).toBeTruthy();
  });
});
