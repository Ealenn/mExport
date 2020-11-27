import "reflect-metadata"

import { Mock, It, Times, ExpectedGetPropertyExpression } from 'moq.ts';

import StatusCommand from "../../src/Commands/StatusCommand";
import { ISMTPServer } from "../../src/Database/Models/SMTPServer";
import { ISMTPService } from '../../src/Services/Abstractions/ISMTPService';
import { ILoggerService } from '../../src/Services/Abstractions/ILoggerService';
import { SMTPServerRepository } from "../../src/Database/SMTPServerRepository";

describe('Commands/StatusCommand', function () {

  let SmtpServiceMock: Mock<ISMTPService>;
  let SmtpServerRepositoryMock: Mock<SMTPServerRepository>;
  let LoggerServiceMock: Mock<ILoggerService>;

  beforeEach(() => {
    SmtpServiceMock = new Mock<ISMTPService>();
    SmtpServerRepositoryMock = new Mock<SMTPServerRepository>();
    LoggerServiceMock = new Mock<ILoggerService>();

    LoggerServiceMock.setup(x => x.Error).returns(() => {});
    LoggerServiceMock.setup(x => x.Information).returns(() => {});
  });

  it('Without Servers', async function () {
    // A;
    SmtpServerRepositoryMock.setup(x => x.FindAll).returns(async () => new Array<ISMTPServer>());

    // A
    const command = new StatusCommand(SmtpServiceMock.object(), SmtpServerRepositoryMock.object(), LoggerServiceMock.object());
    const result = await command.Action(<any> {});

    // A
    LoggerServiceMock.verify(x => x.Error, Times.Once());
    expect(result).toBeTruthy();
  });

  it('With Servers', async function () {
    // A;
    SmtpServerRepositoryMock.setup(x => x.FindAll).returns(async () => new Array<ISMTPServer>(
        <ISMTPServer>{
            id: 1,
            user: 'example',
            password: 'example',
            server: 'smtp.example.com',
            port: 25,
            secure: true
        }
    ));
    SmtpServiceMock.setup(x => x.CheckAccount(It.IsAny<ISMTPServer>())).returns(new Promise<boolean>((_) => _(true)));

    // A
    const command = new StatusCommand(SmtpServiceMock.object(), SmtpServerRepositoryMock.object(), LoggerServiceMock.object());
    const result = await command.Action(<any> {});

    // A
    LoggerServiceMock.verify(x => x.Error, Times.Never());
    LoggerServiceMock.verify(x => x.Information, Times.AtLeastOnce());
    SmtpServiceMock.verify(x => x.CheckAccount, Times.Once());
    expect(result).toBeTruthy();
  });
});
