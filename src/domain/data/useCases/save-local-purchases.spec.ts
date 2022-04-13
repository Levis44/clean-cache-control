class LocalSavePurchases {
  constructor(private readonly cacheStorage: ICacheStorage) {}

  async save(): Promise<void> {
    this.cacheStorage.delete("purchases");
  }
}

interface ICacheStorage {
  delete(key: string): void;
}

class CacheStorageSpy implements ICacheStorage {
  deleteCounts = 0;
  key: string;

  delete(key: string): void {
    this.deleteCounts++;
    this.key = key;
  }
}

type SutTypes = {
  sut: LocalSavePurchases;
  cacheStorage: CacheStorageSpy;
};

const makeSut = (): SutTypes => {
  const cacheStorage = new CacheStorageSpy();
  const sut = new LocalSavePurchases(cacheStorage);

  return {
    sut,
    cacheStorage,
  };
};

describe("LocalSavePurchases", () => {
  test("Should not delete cache on sut.init", () => {
    const { cacheStorage } = makeSut();

    expect(cacheStorage.deleteCounts).toBe(0);
  });

  test("Should delete old cache on sut.save", async () => {
    const { sut, cacheStorage } = makeSut();

    await sut.save();

    expect(cacheStorage.deleteCounts).toBe(1);
    expect(cacheStorage.key).toBe("purchases");
  });
});
