import { IMailServer, MailServer } from "./Models/MailServer";
import { Email, IEmail } from "./Models/Email"
import { ILoggerService } from "../Services/Abstractions/ILoggerService";
import { inject, injectable } from "tsyringe";

/* istanbul ignore file */
@injectable()
export class MailServerRepository {
  private _loggerService: ILoggerService;

  constructor(
    @inject('ILoggerService') loggerService: ILoggerService
  )
  {
    this._loggerService = loggerService;
  }

  public async Save(mailServer: IMailServer): Promise<IMailServer> {
    return await MailServer.create(mailServer);
  }

  public async Find(filter: any): Promise<IMailServer|null> {
    return await MailServer.findOne({
      where: filter
    });
  }

  public async FindAll(): Promise<IMailServer[]> {
    return await MailServer.findAll();
  }

  public async Remove(filter: any): Promise<number> {
    const server = await this.Find(filter);
    if (server == null)
    {
      return 0;
    }

    await this.PurgeEmails(server);
    return await MailServer.destroy({
      where: filter
    });
  }

  public async SaveEmail(email : IEmail): Promise<boolean> {
    try {
      Email.create(email);
    } catch(exception) {
      this._loggerService.Debug(exception);
      return false;
    }
    return true;
  }

  public async PurgeEmails(mailServer: IMailServer): Promise<number> {
    try {
      return await Email.destroy({
        where: {
          serverId: mailServer.id
        }
      })
    } catch {
      return 0;
    }
  }
}
