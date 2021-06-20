import { DomainStats } from '../Models';

export interface IStatsRepository {
  Domain(): Promise<Array<DomainStats>>;
}
