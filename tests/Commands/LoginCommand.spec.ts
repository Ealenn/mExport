import 'reflect-metadata';
import { Mock, It, Times } from 'moq.ts';
import * as prompts from 'prompts';
import LoginCommand from '../../src/Commands/LoginCommand';
import { MailServer } from '../../src/Database/Models/MailServer';
import { IQuestionService } from '../../src/Services/Abstractions/IQuestionService';
import { IMailService } from '../../src/Services/Abstractions/IMailService';
import { ILoggerService } from '../../src/Services/Abstractions/ILoggerService';
import { IMailServerRepository } from '../../src/Database/IMailServerRepository';
import { ImapSimple } from 'imap-simple';

describe('Commands/LoginCommand', function()
{

  let MailServerRepositoryMock : Mock<IMailServerRepository>;
  let QuestionServiceMock : Mock<IQuestionService>;
  let MailServiceMock : Mock<IMailService>;
  let LoggerServiceMock : Mock<ILoggerService>;

  let ImapSimpleMock : Mock<ImapSimple>;

  beforeEach(() =>
  {
    MailServerRepositoryMock = new Mock<IMailServerRepository>();
    QuestionServiceMock = new Mock<IQuestionService>();
    MailServiceMock = new Mock<IMailService>();
    LoggerServiceMock = new Mock<ILoggerService>();
    ImapSimpleMock = new Mock<ImapSimple>();

    LoggerServiceMock.setup(x => x.Error).returns(() => {});
    LoggerServiceMock.setup(x => x.Debug).returns(() => {});
    LoggerServiceMock.setup(x => x.Information).returns(() => {});
  });

  it('Without params', async function()
  {
    // A
    QuestionServiceMock
      .setup(x => x.AskAsync(It.IsAny<prompts.PromptType>(), It.IsAny<string>()))
      .returns(<any> false);
    MailServiceMock.setup(x => x.ConnectAsync(It.IsAny<MailServer>())).returns(new Promise((_) => _(<ImapSimple | PromiseLike<ImapSimple>>ImapSimpleMock.object())));

    // A
    const command = new LoginCommand(MailServerRepositoryMock.object(), QuestionServiceMock.object(), MailServiceMock.object(), LoggerServiceMock.object());
    await command.ActionAsync(<any> {});

    // A
    QuestionServiceMock.verify(x => x.AskAsync('text', It.IsAny<string>()), Times.Exactly(2));
    QuestionServiceMock.verify(x => x.AskAsync('password', It.IsAny<string>()), Times.Once());
    QuestionServiceMock.verify(x => x.AskAsync('number', It.IsAny<string>()), Times.Once());
    QuestionServiceMock.verify(x => x.AskAsync('toggle', It.IsAny<string>()), Times.Once());
  });

  it('With params', async function()
  {
    // A
    QuestionServiceMock
      .setup(x => x.AskAsync(It.IsAny<prompts.PromptType>(), It.IsAny<string>()))
      .returns(<any> false);
    MailServiceMock.setup(x => x.ConnectAsync(It.IsAny<MailServer>())).returns(new Promise((_) => _(<ImapSimple | PromiseLike<ImapSimple>>ImapSimpleMock.object())));

    // A
    const command = new LoginCommand(MailServerRepositoryMock.object(), QuestionServiceMock.object(), MailServiceMock.object(), LoggerServiceMock.object());
    await command.ActionAsync(<any> {
      port: 21,
      password: 'example'
    });

    // A
    QuestionServiceMock.verify(x => x.AskAsync('text', It.IsAny<string>()), Times.Exactly(2));
    QuestionServiceMock.verify(x => x.AskAsync('password', It.IsAny<string>()), Times.Never());
    QuestionServiceMock.verify(x => x.AskAsync('number', It.IsAny<string>()), Times.Never());
    QuestionServiceMock.verify(x => x.AskAsync('toggle', It.IsAny<string>()), Times.Once());
  });

  it('Invalid account', async function()
  {
    // A
    MailServerRepositoryMock.setup(x => x.SaveAsync).returns(async() => <MailServer>{});
    QuestionServiceMock
      .setup(x => x.AskAsync(It.IsAny<prompts.PromptType>(), It.IsAny<string>()))
      .returns(<any> false);
    MailServiceMock.setup(x => x.ConnectAsync(It.IsAny<MailServer>())).throws('');

    // A
    const command = new LoginCommand(MailServerRepositoryMock.object(), QuestionServiceMock.object(), MailServiceMock.object(), LoggerServiceMock.object());
    const result = await command.ActionAsync(<any> {});

    // A
    MailServerRepositoryMock.verify(x => x.SaveAsync, Times.Never());
    LoggerServiceMock.verify(x => x.Error, Times.AtLeastOnce());
    LoggerServiceMock.verify(x => x.Information, Times.Never());
    expect(result).toBeFalsy();
  });

  it('Valid account', async function()
  {
    // A
    MailServerRepositoryMock.setup(x => x.SaveAsync).returns(async() => <MailServer>{});
    QuestionServiceMock
      .setup(x => x.AskAsync(It.IsAny<prompts.PromptType>(), It.IsAny<string>()))
      .returns(<any> false);
    MailServiceMock.setup(x => x.ConnectAsync(It.IsAny<MailServer>())).returns(new Promise((_) => _(<ImapSimple | PromiseLike<ImapSimple>>ImapSimpleMock.object())));

    // A
    const command = new LoginCommand(MailServerRepositoryMock.object(), QuestionServiceMock.object(), MailServiceMock.object(), LoggerServiceMock.object());
    const result = await command.ActionAsync(<any> {});

    // A
    MailServerRepositoryMock.verify(x => x.SaveAsync, Times.Once());
    LoggerServiceMock.verify(x => x.Error, Times.Never());
    LoggerServiceMock.verify(x => x.Information, Times.AtLeastOnce());
    expect(result).toBeTruthy();
  });
});
