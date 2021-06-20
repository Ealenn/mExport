import { Configuration } from '../../Configuration';
import { DomainStats } from './DomainStats';

/* istanbul ignore file */
export class ContextStats
{
  public Configuration: Configuration;
  public Domains: Array<DomainStats>;
}
