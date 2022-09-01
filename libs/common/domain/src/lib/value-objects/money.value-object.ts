export class Money {

  constructor(
    private readonly _amount: number,
  ) {
  }

  static ZERO = new Money(0)
  get amount() {
    return this._amount
  }

  public isGreaterThanZero() {
    return this.amount !== null && this.compareTo(0) > 0
  }

  public isGreaterThan(money: Money): boolean {
    return this.amount !== null && this.compareTo(money.amount) > 0
  }

  public compareTo(number: number): number {
    return this.amount - number;
  }

  public add(money: Money): Money {
    return new Money(this.amount + money.amount)
  }

  public substract(money: Money): Money {

    return new Money(this.setScale(this.amount - money.amount))
  }

  public multiply(multiplier: number): Money {
    return new Money(this.setScale(this.amount * multiplier))
  }

  public equals(o: object): boolean {
    return o instanceof Money && this.amount === o.amount
  }


  private setScale(input: number) {
    return Number(input.toFixed(2))
  }


}
