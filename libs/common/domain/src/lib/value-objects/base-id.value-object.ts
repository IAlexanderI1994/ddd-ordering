export abstract class BaseId<T> {

  protected constructor(private readonly value: T) {
  }

  get getValue() {
    return this.value
  }
}
