export class Money {

  constructor(
    private readonly _amount: number,
  ) {
  }

  get amount() {
    return this._amount
  }

  equals(o: object): boolean {
    return o instanceof Money && this.amount === o.amount
  }


}
