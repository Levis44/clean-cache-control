import { ICacheStorage } from "@/data/protocols/cache";
import { LocalSavePurchases } from "@/data/useCases/";
import { SavePurchases } from "@/domain";

class CacheStorageSpy implements ICacheStorage {
  deleteCallsCounts = 0;
  insertCallsCounts = 0;
  deleteKey: string;
  insertKey: string;
  insertValues: Array<SavePurchases.Params> = [];

  delete(key: string): void {
    this.deleteCallsCounts++;
    this.deleteKey = key;
  }

  insert(key: string, value: any): void {
    this.insertCallsCounts++;
    this.insertKey = key;
    this.insertValues = value;
  }

  simulateDeleteError(): void {
    jest
      .spyOn(CacheStorageSpy.prototype, "delete")
      .mockImplementationOnce(() => {
        throw new Error();
      });
  }
}

const mockPurchases = (): Array<SavePurchases.Params> => [
  {
    id: "1",
    date: new Date(),
    value: 50,
  },
  {
    id: "2",
    date: new Date(),
    value: 70,
  },
];

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

    expect(cacheStorage.deleteCallsCounts).toBe(0);
  });

  test("Should delete old cache on sut.save", async () => {
    const { sut, cacheStorage } = makeSut();

    await sut.save(mockPurchases());

    expect(cacheStorage.deleteCallsCounts).toBe(1);
    expect(cacheStorage.deleteKey).toBe("purchases");
  });

  test("Should not insert new Cahce if delete fails", () => {
    const { sut, cacheStorage } = makeSut();

    // mockamos o retorno desse método
    cacheStorage.simulateDeleteError();

    // como ele vai cair na exceção, com um await não funcionaria
    // dentro do código isso seria tratado em um try catch, mas
    // para o teste vamos só seguir assim
    const promise = sut.save(mockPurchases());
    // como fizemos sem o await, ele vai retornar uma promise
    // de qualquer jeito.

    expect(cacheStorage.insertCallsCounts).toBe(0);
    expect(promise).rejects.toThrow();
  });

  test("Should insert new Cahce if delete succeds", async () => {
    const { sut, cacheStorage } = makeSut();

    const purchases = mockPurchases();

    await sut.save(purchases);

    expect(cacheStorage.insertCallsCounts).toBe(1);
    expect(cacheStorage.deleteCallsCounts).toBe(1);
    expect(cacheStorage.insertKey).toBe("purchases");
    expect(cacheStorage.insertValues).toEqual(purchases);
  });
});
