import { ICacheStorage } from "@/data/protocols/cache";
import { SavePurchases } from "@/domain";

export class LocalSavePurchases implements SavePurchases {
  constructor(private readonly cacheStorage: ICacheStorage) {}

  async save(purchases: Array<SavePurchases.Params>): Promise<void> {
    this.cacheStorage.delete("purchases");
    this.cacheStorage.insert("purchases", purchases);
  }
}
