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
import { SMTPService } from "./Services/SMTPService";
import { SMTPServerRepository } from "./Database/SMTPServerRepository";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

(async () => {
  const CommanderProgram = new Commander.Command();

  /**
   * DI
   */
  container
    // Repository
    .register("SMTPServerRepository", { useClass: SMTPServerRepository })
    // Commands
    .register("LoginCommand", { useClass: LoginCommand })
    .register("DisconnectCommand", { useClass: DisconnectCommand })
    .register("StatusCommand", { useClass: StatusCommand })
    .register("StatusCommand", { useClass: StatusCommand })
    // Services
    .register("ILoggerService", { useClass: LoggerService })
    .register("ICommandsService", { useClass: CommandsService })
    .register("ISMTPService", { useClass: SMTPService })
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
