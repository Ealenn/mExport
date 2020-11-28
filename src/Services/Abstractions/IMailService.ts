import { ImapSimple, Message } from "imap-simple";
import { IEmail } from "../../Database/Models/Email";
import { IMailServer } from "../../Database/Models/MailServer";

export interface IMailService {
  Download(server: ImapSimple, skip: number, take: number): Promise<Message[]>;
  Count(server: ImapSimple): Promise<number>;
  GetEmail(message: Message, serverId: number): Promise<IEmail | null>;
  Connect(server: IMailServer): Promise<ImapSimple>;
}
