import "reflect-metadata"

import { Mock, It, Times, ExpectedGetPropertyExpression } from 'moq.ts';

import * as prompts from 'prompts';
import LoginCommand from "../../src/Commands/LoginCommand";
import { IMailServer } from "../../src/Database/Models/MailServer";
import { IQuestionService } from '../../src/Services/Abstractions/IQuestionService';
import { IMailService } from '../../src/Services/Abstractions/IMailService';
import { ILoggerService } from '../../src/Services/Abstractions/ILoggerService';
import { MailServerRepository } from "../../src/Database/MailServerRepository";
import { ImapSimple } from "imap-simple";

describe('Commands/LoginCommand', function () {

  let MailServerRepositoryMock : Mock<MailServerRepository>;
  let QuestionServiceMock : Mock<IQuestionService>;
  let MailServiceMock : Mock<IMailService>;
  let LoggerServiceMock : Mock<ILoggerService>;

  let ImapSimpleMock : Mock<ImapSimple>;

  beforeEach(() => {
    MailServerRepositoryMock = new Mock<MailServerRepository>();
    QuestionServiceMock = new Mock<IQuestionService>();
    MailServiceMock = new Mock<IMailService>();
    LoggerServiceMock = new Mock<ILoggerService>();
    ImapSimpleMock = new Mock<ImapSimple>();
  });

  it('Without params', async function () {
    // A;
    QuestionServiceMock
      .setup(x => x.Ask(It.IsAny<prompts.PromptType>(), It.IsAny<string>()))
      .returns(<any> false);
    MailServiceMock.setup(x => x.Connect(It.IsAny<IMailServer>())).returns(new Promise((_) => _(<ImapSimple | PromiseLike<ImapSimple>>ImapSimpleMock.object())));
    LoggerServiceMock.setup(x => x.Error).returns(() => {});

    // A
    const command = new LoginCommand(MailServerRepositoryMock.object(), QuestionServiceMock.object(), MailServiceMock.object(), LoggerServiceMock.object());
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
    MailServiceMock.setup(x => x.Connect(It.IsAny<IMailServer>())).returns(new Promise((_) => _(<ImapSimple | PromiseLike<ImapSimple>>ImapSimpleMock.object())));
    LoggerServiceMock.setup(x => x.Error).returns(() => {});

    // A
    const command = new LoginCommand(MailServerRepositoryMock.object(), QuestionServiceMock.object(), MailServiceMock.object(), LoggerServiceMock.object());
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
    MailServerRepositoryMock.setup(x => x.Save).returns(async () => <IMailServer>{})
    QuestionServiceMock
      .setup(x => x.Ask(It.IsAny<prompts.PromptType>(), It.IsAny<string>()))
      .returns(<any> false);
    MailServiceMock.setup(x => x.Connect(It.IsAny<IMailServer>())).throws('');
    LoggerServiceMock.setup(x => x.Error).returns(() => {});
    LoggerServiceMock.setup(x => x.Information).returns(() => {});

    // A
    const command = new LoginCommand(MailServerRepositoryMock.object(), QuestionServiceMock.object(), MailServiceMock.object(), LoggerServiceMock.object());
    const result = await command.Action(<any> {});

    // A
    MailServerRepositoryMock.verify(x => x.Save, Times.Never());
    LoggerServiceMock.verify(x => x.Error, Times.AtLeastOnce());
    LoggerServiceMock.verify(x => x.Information, Times.Never());
    expect(result).toBeFalsy();
  });

  it('Valid account', async function () {
    // A;
    MailServerRepositoryMock.setup(x => x.Save).returns(async () => <IMailServer>{})
    QuestionServiceMock
      .setup(x => x.Ask(It.IsAny<prompts.PromptType>(), It.IsAny<string>()))
      .returns(<any> false);
    MailServiceMock.setup(x => x.Connect(It.IsAny<IMailServer>())).returns(new Promise((_) => _(<ImapSimple | PromiseLike<ImapSimple>>ImapSimpleMock.object())));
    LoggerServiceMock.setup(x => x.Error).returns(() => {});
    LoggerServiceMock.setup(x => x.Information).returns(() => {});

    // A
    const command = new LoginCommand(MailServerRepositoryMock.object(), QuestionServiceMock.object(), MailServiceMock.object(), LoggerServiceMock.object());
    const result = await command.Action(<any> {});

    // A
    MailServerRepositoryMock.verify(x => x.Save, Times.Once());
    LoggerServiceMock.verify(x => x.Error, Times.Never());
    LoggerServiceMock.verify(x => x.Information, Times.AtLeastOnce());
    expect(result).toBeTruthy();
  });
});
