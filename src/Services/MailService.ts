import { IMailServer } from "../Database/Models/MailServer";
import { IMailService } from "./Abstractions/IMailService";
import { ImapSimple, connect as ImapConnect, getParts, Message, MessageBodyPart } from "imap-simple";
import { IConfiguration } from "../Configuration";
import { inject, injectable } from "tsyringe";
import { ILoggerService } from "./Abstractions/ILoggerService";
import { IEmail } from "../Database/Models/Email";
import _ from "lodash";
import { simpleParser } from "mailparser"

/* istanbul ignore file */
@injectable()
export class MailService implements IMailService {
  private _configuration: IConfiguration;
  private _loggerService: ILoggerService;

  constructor(
    @inject('IConfiguration') configuration: IConfiguration,
    @inject('ILoggerService') loggerService: ILoggerService
  ) {
    this._configuration = configuration;
    this._loggerService = loggerService;
  }

  public async Download(server: ImapSimple, skip: number, take: number): Promise<Message[]> {
    try {
      const searchPattern = `${skip + 1}:${skip + take}`;
      const emails = await server.search([searchPattern], {
        bodies: [''],
        markSeen: false
      });
      this._loggerService.Debug(`Download from IMAP: [${searchPattern}] | Skip: ${skip} Take: ${take} Receive: ${emails.length}`);
      return emails;
    } catch (exception) {
      this._loggerService.Debug(exception);
      return new Array<Message>();
    }
  }

  public async Count(server: ImapSimple): Promise<number> {
    await server.openBox('INBOX');
    const emails = await server.search(['ALL'], {
      bodies: [],
      markSeen: false
    });
    return emails.length;
  }

  public async GetEmail(message: Message, serverId: number): Promise<IEmail | null> {
    try {
      let all = _.find(message.parts, { "which": "" });
      let idHeader = "Imap-Id: " + message.attributes.uid + "\r\n";

      let result = await simpleParser(idHeader+all?.body);
      const email = {
        serverId: serverId,
        from: <string>result.from?.value[0].address,
        to: <string>result.to?.value[0].address,
        subject: <string>result.subject || 'EMPTY',
        html: <string>result.html,
        text: <string>result.text
      };

      return email;
    } catch(exception) {
      this._loggerService.Debug(exception);
      return null
    }
  }

  public async Connect(server: IMailServer): Promise<ImapSimple> {
    const imap = await ImapConnect({
      imap: {
        user: server.user,
        password: server.password,
        host: server.server,
        port: server.port,
        tls: server.secure,
        debug: this._configuration.Debug ? console.log : undefined
      }
    });
    await imap.getBoxes();
    await imap.openBox('INBOX');
    return imap;
  }
}
