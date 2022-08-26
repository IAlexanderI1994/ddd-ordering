import * as hash from 'object-hash'

export class StreetAddress {
  get id(): string {
    return this._id;
  }

  get street(): string {
    return this._street;
  }

  get postalCode(): string {
    return this._postalCode;
  }

  get city(): string {
    return this._city;
  }

  private readonly _id: string;
  private readonly _street: string;
  private readonly _postalCode: string;
  private readonly _city: string;

  constructor(id: string, street: string, postalCode: string, city: string) {
    this._id = id;
    this._street = street;
    this._postalCode = postalCode;
    this._city = city;
  }

  public equals(o: object): boolean {
    return o instanceof StreetAddress &&
      this.street === o.street &&
      this.postalCode === o.postalCode &&
      this.city === o.city
  }

  hash() {
    return hash({
      street: this.street,
      postalCode: this.postalCode,
      city: this.city,
    })
  }


}
