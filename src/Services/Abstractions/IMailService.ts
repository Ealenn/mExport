import { ImapSimple, Message } from 'imap-simple';
import { Email } from '../../Database/Entities/Email';
import { MailServer } from '../../Database/Entities/MailServer';

export interface IMailService {
  DownloadAsync(server: ImapSimple, skip: number, take: number): Promise<Message[]>;
  CountAsync(server: ImapSimple): Promise<number>;
  GetEmailAsync(message: Message, server: MailServer): Promise<Email | null>;
  ConnectAsync(server: MailServer): Promise<ImapSimple>;
}
