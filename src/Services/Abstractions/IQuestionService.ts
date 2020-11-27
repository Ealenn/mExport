import { PromptType, PrevCaller } from 'prompts'
export interface IQuestionService {
  Ask(type: PromptType, message: string, validate?: PrevCaller<any, boolean | string | Promise<boolean | string>>): Promise<any>;
}
