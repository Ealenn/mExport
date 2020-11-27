import "reflect-metadata"

import { Mock, It, Times, ExpectedGetPropertyExpression } from 'moq.ts';

import * as prompts from 'prompts';
import LoginCommand from "../../src/Commands/LoginCommand";
import { ISMTPServer } from "../../src/Database/Models/SMTPServer";
import { IQuestionService } from '../../src/Services/Abstractions/IQuestionService';
import { ISMTPService } from '../../src/Services/Abstractions/ISMTPService';
import { ILoggerService } from '../../src/Services/Abstractions/ILoggerService';
import { SMTPServerRepository } from "../../src/Database/SMTPServerRepository";

describe('Commands/LoginCommand', function () {

  let SMTPServerRepositoryMock : Mock<SMTPServerRepository>;
  let QuestionServiceMock : Mock<IQuestionService>;
  let SmtpServiceMock : Mock<ISMTPService>;
  let LoggerServiceMock : Mock<ILoggerService>;

  beforeEach(() => {
    SMTPServerRepositoryMock = new Mock<SMTPServerRepository>();
    QuestionServiceMock = new Mock<IQuestionService>();
    SmtpServiceMock = new Mock<ISMTPService>();
    LoggerServiceMock = new Mock<ILoggerService>();
  });

  it('Without params', async function () {
    // A;
    QuestionServiceMock
      .setup(x => x.Ask(It.IsAny<prompts.PromptType>(), It.IsAny<string>()))
      .returns(<any> false);
    SmtpServiceMock.setup(x => x.CheckAccount(It.IsAny<ISMTPServer>())).returns(new Promise<boolean>((_) => _(false)));
    LoggerServiceMock.setup(x => x.Error).returns(() => {});

    // A
    const command = new LoginCommand(SMTPServerRepositoryMock.object(), QuestionServiceMock.object(), SmtpServiceMock.object(), LoggerServiceMock.object());
    const result = await command.Action(<any> {});

    // A
    QuestionServiceMock.verify(x => x.Ask('text', It.IsAny<string>()), Times.Exactly(2));
    QuestionServiceMock.verify(x => x.Ask('password', It.IsAny<string>()), Times.Once());
    QuestionServiceMock.verify(x => x.Ask('number', It.IsAny<string>()), Times.Once());
    QuestionServiceMock.verify(x => x.Ask('toggle', It.IsAny<string>()), Times.Once());
  });

  it('With params', async function () {
    // A;
    QuestionServiceMock
      .setup(x => x.Ask(It.IsAny<prompts.PromptType>(), It.IsAny<string>()))
      .returns(<any> false);
    SmtpServiceMock.setup(x => x.CheckAccount(It.IsAny<ISMTPServer>())).returns(new Promise<boolean>((_) => _(false)));
    LoggerServiceMock.setup(x => x.Error).returns(() => {});

    // A
    const command = new LoginCommand(SMTPServerRepositoryMock.object(), QuestionServiceMock.object(), SmtpServiceMock.object(), LoggerServiceMock.object());
    const result = await command.Action(<any> {
      port: 21,
      password: 'example'
    });

    // A
    QuestionServiceMock.verify(x => x.Ask('text', It.IsAny<string>()), Times.Exactly(2));
    QuestionServiceMock.verify(x => x.Ask('password', It.IsAny<string>()), Times.Never());
    QuestionServiceMock.verify(x => x.Ask('number', It.IsAny<string>()), Times.Never());
    QuestionServiceMock.verify(x => x.Ask('toggle', It.IsAny<string>()), Times.Once());
  });

  it('Invalid account', async function () {
    // A;
    SMTPServerRepositoryMock.setup(x => x.Save).returns(async () => <ISMTPServer>{})
    QuestionServiceMock
      .setup(x => x.Ask(It.IsAny<prompts.PromptType>(), It.IsAny<string>()))
      .returns(<any> false);
    SmtpServiceMock.setup(x => x.CheckAccount(It.IsAny<ISMTPServer>())).returns(new Promise<boolean>((_) => _(false)));
    LoggerServiceMock.setup(x => x.Error).returns(() => {});
    LoggerServiceMock.setup(x => x.Information).returns(() => {});

    // A
    const command = new LoginCommand(SMTPServerRepositoryMock.object(), QuestionServiceMock.object(), SmtpServiceMock.object(), LoggerServiceMock.object());
    const result = await command.Action(<any> {});

    // A
    SMTPServerRepositoryMock.verify(x => x.Save, Times.Never());
    LoggerServiceMock.verify(x => x.Error, Times.AtLeastOnce());
    LoggerServiceMock.verify(x => x.Information, Times.Never());
    expect(result).toBeFalsy();
  });

  it('Valid account', async function () {
    // A;
    SMTPServerRepositoryMock.setup(x => x.Save).returns(async () => <ISMTPServer>{})
    QuestionServiceMock
      .setup(x => x.Ask(It.IsAny<prompts.PromptType>(), It.IsAny<string>()))
      .returns(<any> false);
    SmtpServiceMock.setup(x => x.CheckAccount(It.IsAny<ISMTPServer>())).returns(new Promise<boolean>((_) => _(true)));
    LoggerServiceMock.setup(x => x.Error).returns(() => {});
    LoggerServiceMock.setup(x => x.Information).returns(() => {});

    // A
    const command = new LoginCommand(SMTPServerRepositoryMock.object(), QuestionServiceMock.object(), SmtpServiceMock.object(), LoggerServiceMock.object());
    const result = await command.Action(<any> {});

    // A
    SMTPServerRepositoryMock.verify(x => x.Save, Times.Once());
    LoggerServiceMock.verify(x => x.Error, Times.Never());
    LoggerServiceMock.verify(x => x.Information, Times.AtLeastOnce());
    expect(result).toBeTruthy();
  });
});
