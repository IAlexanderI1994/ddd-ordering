export abstract class BaseId<T> {

  protected constructor(private readonly value: T) {
  }

  getValue() {
    return this.value
  }
}
