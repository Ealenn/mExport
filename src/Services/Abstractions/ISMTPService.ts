import { ISMTPServer } from "../../Database/Models/SMTPServer";

export interface ISMTPService {
  CheckAccount(server: ISMTPServer): Promise<boolean>;
}
