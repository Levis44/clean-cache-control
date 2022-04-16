export interface ICacheStorage {
  delete(key: string): void;
  insert(key: string, value: any): void;
}
