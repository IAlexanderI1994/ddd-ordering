import {ArgumentMetadata, Injectable, PipeTransform} from "@nestjs/common";

import {RestaurantTypeORMRepository, RestaurantViewEntity} from "@delivery/infra/data-access/restaurant";
import {
  CreateOrderCommandDto,
  ExtendedCreateOrderCommandDto,
  ExtendedOrderItemDto,
  OrderItemDto
} from "@delivery/orders/application";
import * as assert from "node:assert";
import * as fp from 'lodash/fp'
import {plainToInstance} from "class-transformer";
import {validateSync} from "class-validator";

export type RestaurantEntityWithQuantity = RestaurantViewEntity & { quantity: number }

@Injectable()
export class TransformCreateOrderCommandToExtendedDto implements PipeTransform {

  constructor(
    private readonly restaurantRepository: RestaurantTypeORMRepository) {
  }


  private mapOrderItemToExtendedOrderItemDto(item: RestaurantEntityWithQuantity): ExtendedOrderItemDto {

    const extendedOrderItem = plainToInstance(ExtendedOrderItemDto, {
      productId: item.productId,
      quantity: item.quantity,
      price: item.productPrice,
      subtotal: item.productPrice * item.quantity
    })
    const errors = validateSync(extendedOrderItem)

    assert.equal(errors.length, 0, `Incorrect order item: ${JSON.stringify(errors)}`)

    return extendedOrderItem
  }

  private getExtendedOrderItems(productsEntities: RestaurantViewEntity[], orderItems: OrderItemDto[]): ExtendedOrderItemDto[] {

    const result = fp.pipe(
      fp.groupBy('productId'),
      fp.map(v =>
        this.mapOrderItemToExtendedOrderItemDto(
          <RestaurantEntityWithQuantity>v.reduce((result, item) => ({...result, ...item}), {}))
      ),
    )
    ([...productsEntities, ...orderItems])

    return result;
  }

  private async getProductEntitiesFromDTO(dto: CreateOrderCommandDto): Promise<RestaurantViewEntity[]> {
    const productsEntities = await this.restaurantRepository
      .findByRestaurantIdAndProductIdIn(
        dto.restaurantId,
        dto.orderItems.map(({productId: pid}) => pid))

    assert.equal(productsEntities.length, dto.orderItems.length, 'Some products not found in chosen restaurant')

    return productsEntities;
  }

  private calculateOrderPrice(orderItems: ExtendedOrderItemDto[]): number {
    const price =  orderItems.reduce((sum, {subtotal}) => sum + subtotal, 0)
    assert.equal(price > 0, true, `Incorrect price: Got: ${price}`)

    return price;
  }

  private combineExtendedCreateOrderCommandDTO(dto: CreateOrderCommandDto, orderItems: ExtendedOrderItemDto[]): ExtendedCreateOrderCommandDto {
    const price = this.calculateOrderPrice(orderItems)
    const extendedCreateOrderCommandDto = plainToInstance(ExtendedCreateOrderCommandDto, {
      ...dto,
      orderItems,
      price
    });
    const createOrderErrors = validateSync(extendedCreateOrderCommandDto)
    const isOrderCreateCommandCorrect = createOrderErrors.length === 0

    assert.equal(isOrderCreateCommandCorrect, true, `Incorrect order create command: ${JSON.stringify(createOrderErrors)}`)

    return extendedCreateOrderCommandDto;
  }

  async transform(dto: CreateOrderCommandDto, {metatype}: ArgumentMetadata): Promise<ExtendedCreateOrderCommandDto> {
    const productsEntities = await this.getProductEntitiesFromDTO(dto)
    const orderItems = this.getExtendedOrderItems(productsEntities, dto.orderItems)

    return this.combineExtendedCreateOrderCommandDTO(dto, orderItems)
  }

}
