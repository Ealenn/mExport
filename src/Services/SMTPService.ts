import { ISMTPServer } from "../Database/Models/SMTPServer";
import { ISMTPService } from "./Abstractions/ISMTPService";
import nodemailer from "nodemailer";
import { IConfiguration } from "../Configuration";
import { inject, injectable } from "tsyringe";
import Mail from "nodemailer/lib/mailer";
import { ILoggerService } from "./Abstractions/ILoggerService";

@injectable()
export class SMTPService implements ISMTPService {
  private _configuration: IConfiguration;
  private _loggerService: ILoggerService;

  constructor(
    @inject('IConfiguration') configuration: IConfiguration,
    @inject('ILoggerService') loggerService: ILoggerService
  ) {
    this._configuration = configuration;
    this._loggerService = loggerService;
  }

  public async CheckAccount(server: ISMTPServer): Promise<boolean> {
    try {
      const Transporter = this.Transporter(server);
      const result = await Transporter.verify();
      Transporter.close();
      return result;
    } catch (exception) {
      this._loggerService.Debug('ERROR', exception);
      return false;
    }
  }

  private Transporter(server: ISMTPServer): Mail {
    return nodemailer.createTransport({
      host: server.server,
      port: server.port,
      secure: server.secure,
      auth: {
        user: server.user,
        pass: server.password,
      },
      logger: this._configuration.Debug,
      debug: false
    });
  }
}
