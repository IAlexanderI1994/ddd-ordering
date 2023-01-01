import {ArgumentMetadata, Injectable, PipeTransform} from "@nestjs/common";

import {RestaurantTypeORMRepository} from "@delivery/infra/data-access/restaurant";
import {CreateOrderCommandDto, ExtendedCreateOrderCommandDto} from "@delivery/orders/application";

@Injectable()
export class TransformCreateOrderCommandToExtendedDto implements PipeTransform {

  constructor(
    private readonly restaurantRepository: RestaurantTypeORMRepository) {
  }

  async transform(dto: CreateOrderCommandDto, {metatype}: ArgumentMetadata): Promise<ExtendedCreateOrderCommandDto> {


    const restaurant = await this.restaurantRepository
      .findByRestaurantIdAndProductIdIn(
        dto.restaurantId,
        dto.orderItems.map(({productId: pid}) => pid))

    console.log(restaurant)

    return;
    // if (!offer) throw new NotFoundException()
    //
    // try {
    //   return Mappers.Contract.fromOfferToDomainModel(
    //     offer,
    //     dto.termId,
    //     dto.rentalStart,
    //     dto.rentalEnd,
    //     dto.depositOption,
    //     dto.paymentStartOption,
    //     dto.paymentTypeOption,
    //   )
    // } catch (e) {
    //   console.log(e)
    //
    //   throw new BadRequestException()
    // }

  }

}
