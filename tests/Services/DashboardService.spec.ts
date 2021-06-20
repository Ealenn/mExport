import 'reflect-metadata';
import { It, Mock, Times } from 'moq.ts';
import { IConfiguration } from '../../src/Configuration';
import { IStatsRepository } from '../../src/Database/Abstractions';
import { IHandlebarsService, ILoggerService } from '../../src/Services/Abstractions';
import { DashboardService } from '../../src/Services';
import { ContextStats, DomainStats } from '../../src/Database/Models';

describe('Services/DashboardService', function()
{
  let HandlebarsServiceMock: Mock<IHandlebarsService>;
  let StatsRepositoryMock: Mock<IStatsRepository>;
  let ConfigurationMock: Mock<IConfiguration>;
  let LoggerServiceMock: Mock<ILoggerService>;

  beforeEach(() =>
  {
    HandlebarsServiceMock = new Mock<IHandlebarsService>();
    StatsRepositoryMock = new Mock<IStatsRepository>();
    ConfigurationMock = new Mock<IConfiguration>();
    LoggerServiceMock = new Mock<ILoggerService>();

    LoggerServiceMock.setup(x => x.Information).returns(() => {});
    ConfigurationMock.setup(x => x.DatabasePath).returns(__dirname);
  });

  it('Generate', async function()
  {
    // A
    HandlebarsServiceMock
      .setup(x => x.SaveFileAsync(It.IsAny<string>(), It.IsAny<ContextStats>()))
      .returns(new Promise(_ => _()));
    const fakeDomainsStats = [
      {
        Count: 5,
        Host: 'example.com',
        On: 'example@host.net'
      } as DomainStats
    ] as DomainStats[];
    StatsRepositoryMock.setup(x => x.DomainAsync()).returns(new Promise(_ => _(fakeDomainsStats)));

    // A
    const service = new DashboardService(
      HandlebarsServiceMock.object(),
      StatsRepositoryMock.object(),
      ConfigurationMock.object(),
      LoggerServiceMock.object());
    const result = await service.GenerateAsync(__dirname);

    // A
    LoggerServiceMock.verify(x => x.Information, Times.Once());
    HandlebarsServiceMock.verify(x => x.SaveFileAsync(__dirname, It.Is<ContextStats>(param =>
    {
      return param.Domains.includes(fakeDomainsStats[0]) &&
      param.Configuration.DatabasePath == __dirname;
    })), Times.Once());
    expect(result).toBeTruthy();
  });
});
