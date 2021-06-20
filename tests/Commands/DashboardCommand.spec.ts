import 'reflect-metadata';
import { Mock, Times } from 'moq.ts';
import { DashboardCommand } from '../../src/Commands';
import { IQuestionService, IDashboardService, ILoggerService } from '../../src/Services/Abstractions';

describe('Commands/DashboardCommand', function()
{

  let DashboardServiceyMock: Mock<IDashboardService>;
  let QuestionServiceyMock: Mock<IQuestionService>;
  let LoggerServiceMock: Mock<ILoggerService>;

  beforeEach(() =>
  {
    DashboardServiceyMock = new Mock<IDashboardService>();
    QuestionServiceyMock = new Mock<IQuestionService>();
    LoggerServiceMock = new Mock<ILoggerService>();

    LoggerServiceMock.setup(x => x.Error).returns(() => {});
    LoggerServiceMock.setup(x => x.Information).returns(() => {});
  });

  it('Without argument', async function()
  {
    // A
    QuestionServiceyMock.setup(x => x.AskAsync).returns(async() => {});

    // A
    const command = new DashboardCommand(DashboardServiceyMock.object(), QuestionServiceyMock.object(), LoggerServiceMock.object());
    await command.ActionAsync(<any>{});

    // A
    QuestionServiceyMock.verify(x => x.AskAsync, Times.Once());
  });

  it('Without invalid path', async function()
  {
    // A
    QuestionServiceyMock.setup(x => x.AskAsync).returns(async() => {});

    // A
    const command = new DashboardCommand(DashboardServiceyMock.object(), QuestionServiceyMock.object(), LoggerServiceMock.object());
    const result = await command.ActionAsync(<any>{
      path: '/test/path/not/found'
    });

    // A
    QuestionServiceyMock.verify(x => x.AskAsync, Times.Never());
    LoggerServiceMock.verify(x => x.Error, Times.AtLeastOnce());
    expect(result).toBeFalsy();
  });

  it('With valid path and success', async function()
  {
    // A
    QuestionServiceyMock.setup(x => x.AskAsync).returns(async() => {});
    DashboardServiceyMock.setup(x => x.GenerateAsync).returns(async() => true);

    // A
    const command = new DashboardCommand(DashboardServiceyMock.object(), QuestionServiceyMock.object(), LoggerServiceMock.object());
    const result = await command.ActionAsync(<any>{
      path: __dirname
    });

    // A
    QuestionServiceyMock.verify(x => x.AskAsync, Times.Never());
    LoggerServiceMock.verify(x => x.Error, Times.Never());
    DashboardServiceyMock.verify(x => x.GenerateAsync, Times.Once());
    expect(result).toBeTruthy();
  });

  it('With valid path and error', async function()
  {
    // A
    QuestionServiceyMock.setup(x => x.AskAsync).returns(async() => {});
    DashboardServiceyMock.setup(x => x.GenerateAsync).returns(async() => false);

    // A
    const command = new DashboardCommand(DashboardServiceyMock.object(), QuestionServiceyMock.object(), LoggerServiceMock.object());
    const result = await command.ActionAsync(<any>{
      path: __dirname
    });

    // A
    QuestionServiceyMock.verify(x => x.AskAsync, Times.Never());
    LoggerServiceMock.verify(x => x.Error, Times.Never());
    DashboardServiceyMock.verify(x => x.GenerateAsync, Times.Once());
    expect(result).toBeFalsy();
  });
});
