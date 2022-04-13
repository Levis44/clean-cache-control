import { ICacheStorage } from "@/data/protocols/cache";

export class LocalSavePurchases {
  constructor(private readonly cacheStorage: ICacheStorage) {}

  async save(): Promise<void> {
    this.cacheStorage.delete("purchases");
  }
}
