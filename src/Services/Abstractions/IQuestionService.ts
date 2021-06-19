import { PromptType, PrevCaller } from 'prompts';

export interface IQuestionService {
  AskAsync(type: PromptType, message: string, validate?: PrevCaller<any, boolean | string | Promise<boolean | string>>): Promise<any>;
}
