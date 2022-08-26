import * as hash from 'object-hash'

export abstract class BaseEntity<ID> {

  private id: ID;

  public getId(): ID {
    return this.id;
  }

  public setId(id: ID): void {
    this.id = id;
  }

  equals(o: BaseEntity<any>): boolean {
    return o instanceof this.constructor && this.getId() === o.getId()
  }

  hashCode() {
    return hash(this.id)
  }


}
