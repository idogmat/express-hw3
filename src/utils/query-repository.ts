abstract class QueryRepository<T, TId> {
  // Абстрактный метод без реализации.
  abstract find(item: T): T[];

  // Абстрактный метод без реализации.
  abstract findOne(id: TId): T | null;

  // Абстрактный метод без реализации.
  abstract create(item: T): T;

  // Абстрактный метод без реализации.
  abstract update(id: TId, item: T): T;

  // Абстрактный метод без реализации.
  abstract delete(id: TId): void;

  // Неабстрактный метод с реализацией.
  someUtilityFunction(args: any): void {
    // Базовая реализация, которая может быть переопределена в подклассах
    // или использована как есть.
  }
}
