import { ICacheStorage } from "@/data/protocols/cache";
import { LocalSavePurchases } from "@/data/useCases/";

class CacheStorageSpy implements ICacheStorage {
  deleteCallsCounts = 0;
  insertCallsCounts = 0;
  deleteKey: string;
  insertKey: string;

  delete(key: string): void {
    this.deleteCallsCounts++;
    this.deleteKey = key;
  }

  insert(key: string): void {
    this.insertCallsCounts++;
    this.insertKey = key;
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

    expect(cacheStorage.deleteCallsCounts).toBe(0);
  });

  test("Should delete old cache on sut.save", async () => {
    const { sut, cacheStorage } = makeSut();

    await sut.save();

    expect(cacheStorage.deleteCallsCounts).toBe(1);
    expect(cacheStorage.deleteKey).toBe("purchases");
  });

  test("Should not insert new Cahce if delete fails", () => {
    const { sut, cacheStorage } = makeSut();

    // mockamos o retorno desse método
    jest.spyOn(cacheStorage, "delete").mockImplementationOnce(() => {
      throw new Error();
    });

    // como ele vai cair na exceção, com um await não funcionaria
    // dentro do código isso seria tratado em um try catch, mas
    // para o teste vamos só seguir assim
    const promise = sut.save();
    // como fizemos sem o await, ele vai retornar uma promise
    // de qualquer jeito.

    expect(cacheStorage.insertCallsCounts).toBe(0);
    expect(promise).rejects.toThrow();
  });

  test("Should insert new Cahce if delete succeds", async () => {
    const { sut, cacheStorage } = makeSut();

    const promise = sut.save();

    expect(cacheStorage.insertCallsCounts).toBe(1);
    expect(cacheStorage.deleteCallsCounts).toBe(1);
    expect(cacheStorage.insertKey).toBe("purchases");
  });
});
