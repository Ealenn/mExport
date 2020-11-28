import "reflect-metadata"

import { Mock, It, Times, ExpectedGetPropertyExpression } from 'moq.ts';

import StatusCommand from "../../src/Commands/StatusCommand";
import { IMailServer } from "../../src/Database/Models/MailServer";
import { IMailService } from '../../src/Services/Abstractions/IMailService';
import { ILoggerService } from '../../src/Services/Abstractions/ILoggerService';
import { MailServerRepository } from "../../src/Database/MailServerRepository";
import { ImapSimple } from "imap-simple";

describe('Commands/StatusCommand', function () {

  let MailServiceMock: Mock<IMailService>;
  let MailServerRepositoryMock: Mock<MailServerRepository>;
  let LoggerServiceMock: Mock<ILoggerService>;

  let ImapSimpleMock : Mock<ImapSimple>;

  beforeEach(() => {
    MailServiceMock = new Mock<IMailService>();
    MailServerRepositoryMock = new Mock<MailServerRepository>();
    LoggerServiceMock = new Mock<ILoggerService>();
    ImapSimpleMock = new Mock<ImapSimple>();

    LoggerServiceMock.setup(x => x.Error).returns(() => {});
    LoggerServiceMock.setup(x => x.Information).returns(() => {});
  });

  it('Without Servers', async function () {
    // A;
    MailServerRepositoryMock.setup(x => x.FindAll).returns(async () => new Array<IMailServer>());

    // A
    const command = new StatusCommand(MailServiceMock.object(), MailServerRepositoryMock.object(), LoggerServiceMock.object());
    const result = await command.Action(<any> {});

    // A
    LoggerServiceMock.verify(x => x.Error, Times.Once());
    expect(result).toBeTruthy();
  });

  it('With Servers', async function () {
    // A;
    MailServerRepositoryMock.setup(x => x.FindAll).returns(async () => new Array<IMailServer>(
        <IMailServer>{
            id: 1,
            user: 'example',
            password: 'example',
            server: 'smtp.example.com',
            port: 25,
            secure: true
        }
    ));
    MailServiceMock.setup(x => x.Connect(It.IsAny<IMailServer>())).returns(new Promise((_) => _(<ImapSimple | PromiseLike<ImapSimple>>ImapSimpleMock.object())));

    // A
    const command = new StatusCommand(MailServiceMock.object(), MailServerRepositoryMock.object(), LoggerServiceMock.object());
    const result = await command.Action(<any> {});

    // A
    LoggerServiceMock.verify(x => x.Error, Times.Never());
    LoggerServiceMock.verify(x => x.Information, Times.AtLeastOnce());
    MailServiceMock.verify(x => x.Connect, Times.Once());
    expect(result).toBeTruthy();
  });

  it('With Servers Fail', async function () {
    // A;
    MailServerRepositoryMock.setup(x => x.FindAll).returns(async () => new Array<IMailServer>(
      <IMailServer>{
        id: 1,
        user: 'example',
        password: 'example',
        server: 'smtp.example.com',
        port: 25,
        secure: true
      }
    ));
    MailServiceMock.setup(x => x.Connect(It.IsAny<IMailServer>())).throws('');

    // A
    const command = new StatusCommand(MailServiceMock.object(), MailServerRepositoryMock.object(), LoggerServiceMock.object());
    const result = await command.Action(<any>{});

    // A
    LoggerServiceMock.verify(x => x.Error, Times.Never());
    LoggerServiceMock.verify(x => x.Information, Times.AtLeastOnce());
    MailServiceMock.verify(x => x.Connect, Times.Once());
    expect(result).toBeTruthy();
  });
});
