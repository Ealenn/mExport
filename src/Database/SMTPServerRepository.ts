import { ISMTPServer, SMTPServer } from "./Models/SMTPServer";

export class SMTPServerRepository {
  public async Save(smtpServer: ISMTPServer): Promise<ISMTPServer> {
    return await SMTPServer.create(smtpServer);
  }

  public async FindAll(): Promise<ISMTPServer[]> {
    return await SMTPServer.findAll();
  }

  public async Remove(filter: any): Promise<number> {
    return await SMTPServer.destroy({
      where: filter
    });
  }
}
