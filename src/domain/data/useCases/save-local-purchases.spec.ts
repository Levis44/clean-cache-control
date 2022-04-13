class LocalSavePurchases {
  constructor(private readonly cacheStorage: ICacheStorage) {}

  async save(): Promise<void> {
    this.cacheStorage.delete();
  }
}

interface ICacheStorage {
  delete(): void;
}

class CacheStorageSpy implements ICacheStorage {
  deleteCounts = 0;

  delete(): void {
    this.deleteCounts++;
  }
}

describe("LocalSavePurchases", () => {
  test("Should not delete cache on sut.init", () => {
    const cacheStorage = new CacheStorageSpy();
    new LocalSavePurchases(cacheStorage);

    expect(cacheStorage.deleteCounts).toBe(0);
  });

  test("Should delete old cache on sut.save", async () => {
    const cacheStorage = new CacheStorageSpy();
    const sut = new LocalSavePurchases(cacheStorage);

    await sut.save();

    expect(cacheStorage.deleteCounts).toBe(1);
  });
});
