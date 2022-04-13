class LocalSavePurchases {
  constructor(private readonly cacheStorage: CacheStorage) {}
}

interface CacheStorage {}

class CacheStorageSpy implements CacheStorage {
  deletedCounts = 0;
}

describe("LocalSavePurchases", () => {
  test("Should not delete cache on sut.init", () => {
    const cacheStorage = new CacheStorageSpy();
    new LocalSavePurchases(cacheStorage);

    expect(cacheStorage.deletedCounts).toBe(0);
  });
});
