import * as hash from 'object-hash'

export abstract class BaseEntity<T> {

  private id: T;

  public getId(): T {
    return this.id;
  }

  public setId(id: T): void {
    this.id = id;
  }

  equals(o: object): boolean {
    if (o === null || o === undefined) {
      return false;
    }
    return o instanceof this.constructor;
  }

  hashCode() {
    return hash(this.id)
  }


}
