import { Email, MailServer } from '../Entities';

export interface IMailServerRepository {
  ConnectAsync(database: string, logging: boolean): Promise<void>;
  SaveAsync(mailServer: MailServer): Promise<MailServer>;
  FindAsync(filter: any): Promise<MailServer|undefined>;
  FindAllAsync(): Promise<Array<MailServer>>;
  RemoveAsync(mailServer: MailServer): Promise<void>;
  SaveEmailAsync(email : Email): Promise<Email>;
  PurgeEmailsAsync(mailServer: MailServer): Promise<number>;
}
