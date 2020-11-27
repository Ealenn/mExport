export default interface ICommand {
  Command: string;
  Description: string;
  Options: string[],
  Action(...args: any[]): Promise<Boolean>;
}
