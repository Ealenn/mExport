import { ContextStats } from '../../Database/Models';

export interface IHandlebarsService {
  SaveFileAsync(folderPath: string, context: ContextStats): Promise<void>;
}
