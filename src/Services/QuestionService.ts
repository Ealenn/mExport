import { PromptObject, PromptType, PrevCaller, prompt } from 'prompts';
import { IQuestionService } from './Abstractions';

/* istanbul ignore file */
export class QuestionService implements IQuestionService
{
  public async AskAsync(type: PromptType, message: string, validate?: PrevCaller<any, boolean | string | Promise<boolean | string>>): Promise<any>
  {
    return await this.getValueOf({
      type: type,
      name: 'value',
      message: message,
      active: 'Yes',
      inactive: 'No',
      validate: validate ? validate : value => value != undefined && value != ''
    });
  }

  private async getValueOf(question: PromptObject<'value'>): Promise<any>
  {
    const result = await prompt(question);
    return result.value;
  }
}
