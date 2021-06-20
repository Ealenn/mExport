export interface IDashboardService {
  GenerateAsync(path: string): Promise<boolean>;
}
