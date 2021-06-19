export default interface ICommand {
  Command: string;
  Description: string;
  Options: string[];
  ActionAsync(...args: any[]): Promise<boolean>;
}
