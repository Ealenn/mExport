#!/usr/bin/env node

import "reflect-metadata";
import * as Commander from 'commander';
import { container } from "tsyringe";
import DisconnectCommand from "./Commands/DisconnectCommand";
import LoginCommand from "./Commands/LoginCommand";
import StatusCommand from "./Commands/StatusCommand";
import { Configuration } from "./Configuration";
import Program from './Program';
import { CommandsService } from "./Services/CommandsService";
import { LoggerService } from "./Services/LoggerService";
import { QuestionService } from "./Services/QuestionService";
import { MailService } from "./Services/MailService";
import { MailServerRepository } from "./Database/MailServerRepository";
import SynchronizeCommand from "./Commands/SynchronizeCommand";
import { ExitService } from "./Services/ExitService";

(async () => {
  const CommanderProgram = new Commander.Command();

  /**
   * DI
   */
  container
    // Repository
    .register("IMailServerRepository", { useClass: MailServerRepository })
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
    .register("IExitService", { useClass: ExitService })
    // Configuration
    .register("IConfiguration", { useClass: Configuration });

  /**
   * Main Program
   */
  const program = container.resolve(Program);
  await program.Run(CommanderProgram);
})();
