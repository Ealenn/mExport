#!/usr/bin/env node

import 'reflect-metadata';
import * as Commander from 'commander';
import { container } from 'tsyringe';
import { Configuration } from './Configuration';
import Program from './Program';
import { MailServerRepository } from './Database';
import { DashboardCommand, SynchronizeCommand, StatusCommand, LoginCommand, DisconnectCommand } from './Commands';
import { DashboardService, ExitService, MailService, QuestionService, LoggerService, CommandsService, HandlebarsService } from './Services';
import { StatsRepository } from './Database/StatsRepository';

(async() =>
{
  const CommanderProgram = new Commander.Command();

  /**
   * DI
   */
  container
    // Repository
    .register('IMailServerRepository', { useClass: MailServerRepository })
    .register('IStatsRepository', { useClass: StatsRepository })
    // Commands
    .register('LoginCommand', { useClass: LoginCommand })
    .register('DisconnectCommand', { useClass: DisconnectCommand })
    .register('StatusCommand', { useClass: StatusCommand })
    .register('SynchronizeCommand', { useClass: SynchronizeCommand })
    .register('DashboardCommand', { useClass: DashboardCommand })
    // Services
    .register('ILoggerService', { useClass: LoggerService })
    .register('ICommandsService', { useClass: CommandsService })
    .register('IMailService', { useClass: MailService })
    .register('IQuestionService', { useClass: QuestionService })
    .register('IExitService', { useClass: ExitService })
    .register('IDashboardService', { useClass: DashboardService })
    .register('IHandlebarsService', { useClass: HandlebarsService })
    // Configuration
    .register('IConfiguration', { useClass: Configuration });

  /**
   * Main Program
   */
  const program = container.resolve(Program);
  await program.Run(CommanderProgram);
})();
