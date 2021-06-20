import { DomainStats } from '../Models';

export interface IStatsRepository {
  DomainAsync(): Promise<Array<DomainStats>>;
}
