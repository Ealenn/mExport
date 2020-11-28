#!/usr/bin/env node

import "reflect-metadata";
import * as Commander from 'commander';
import { container } from "tsyringe";
import DisconnectCommand from "./Commands/DisconnectCommand";
import LoginCommand from "./Commands/LoginCommand";
import StatusCommand from "./Commands/StatusCommand";
import { Configuration, IConfiguration } from "./Configuration";
import { SequelizeFactory } from "./Factory/SequelizeFactory";
import Program from './Program'
import { CommandsService } from "./Services/CommandsService";
import { LoggerService } from "./Services/LoggerService";
import { QuestionService } from "./Services/QuestionService";
import { MailService } from "./Services/MailService";
import { MailServerRepository } from "./Database/MailServerRepository";
import SynchronizeCommand from "./Commands/SynchronizeCommand";

(async () => {
  const CommanderProgram = new Commander.Command();

  /**
   * DI
   */
  container
    // Repository
    .register("MailServerRepository", { useClass: MailServerRepository })
    // Commands
    .register("LoginCommand", { useClass: LoginCommand })
    .register("DisconnectCommand", { useClass: DisconnectCommand })
    .register("StatusCommand", { useClass: StatusCommand })
    .register("SynchronizeCommand", { useClass: SynchronizeCommand })
    // Services
    .register("ILoggerService", { useClass: LoggerService })
    .register("ICommandsService", { useClass: CommandsService })
    .register("IMailService", { useClass: MailService })
    .register("IQuestionService", { useClass: QuestionService })
    // Factory
    .register("ISequelizeFactory", { useClass: SequelizeFactory })
    // Configuration
    .register("IConfiguration", { useClass: Configuration });

  /**
   * Main Program
   */
  let program = container.resolve(Program);
  await program.Sequelize();
  await program.Landing();
  await program.Commander(CommanderProgram);
})();
