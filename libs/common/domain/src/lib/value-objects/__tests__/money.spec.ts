import {Money} from "../money.value-object";

describe('Money', () => {

  it('Sum', function () {

    expect.assertions(1)
    const money = new Money(100)

    const sum = money.add(new Money(50)).amount

    expect(sum).toEqual(150)

  });
  it('Substract', function () {

    expect.assertions(1)
    const money = new Money(100)

    const sum = money.substract(new Money(50)).amount

    expect(sum).toEqual(50)

  });
  it('Multiply', function () {

    expect.assertions(1)
    const money = new Money(100)

    const sum = money.multiply(3).amount

    expect(sum).toEqual(300)

  });

  it('should be greater', function () {
    expect.assertions(2)
    const money = new Money(100)
    const money2 = new Money(200)

    expect(money2.isGreaterThan(money)).toBeTruthy()
    expect(money.isGreaterThan(money2)).toBeFalsy()

  });

  it('should equals', function () {
    expect.assertions(2)

    const money = new Money(100)
    const money2 = new Money(100)
    const money3 = new Money(200)

    expect(money).toEqual(money2)
    expect(money).not.toEqual(money3)
  });


})
