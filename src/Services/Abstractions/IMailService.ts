import { ImapSimple, Message } from 'imap-simple';
import { Email } from '../../Database/Models/Email';
import { MailServer } from '../../Database/Models/MailServer';

export interface IMailService {
  DownloadAsync(server: ImapSimple, skip: number, take: number): Promise<Message[]>;
  CountAsync(server: ImapSimple): Promise<number>;
  GetEmailAsync(message: Message, server: MailServer): Promise<Email | null>;
  ConnectAsync(server: MailServer): Promise<ImapSimple>;
}
