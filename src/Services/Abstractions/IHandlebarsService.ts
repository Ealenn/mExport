import { ContextStats } from '../../Database/Models';

export interface IHandlebarsService {
  SaveFile(folderPath: string, context: ContextStats): Promise<void>;
}
