import { injectable } from 'tsyringe';
import { IExitService } from './Abstractions/IExitService';

/* istanbul ignore file */
@injectable()
export class ExitService implements IExitService
{
  OnError(): void
  {
    process.exit(-1);
  }

  OnSuccess(): void
  {
    process.exit(0);
  }
}
