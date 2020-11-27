export interface ILoggerService {
  Information(...write: any[]): void;
  Debug(...write: any[]): void;
  Error(...write: any[]): void;
  Ascii(text: any): void;
}
