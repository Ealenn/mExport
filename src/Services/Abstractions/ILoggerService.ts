export interface ILoggerService {
  Information(...write: any[]): void;
  Debug(...write: any[]): void;
  Error(...write: any[]): void;
  Ascii(write: any): void;
}
