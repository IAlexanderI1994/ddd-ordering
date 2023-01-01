import {IsNotEmpty, IsNumber, IsUUID, Min, ValidateNested} from "class-validator";
import {ExtendedOrderItemDto, OrderItemDto} from "./OrderItemDto";
import {OrderAddressDto} from "./OrderAddress";
export class CreateOrderCommandDto {

  @IsUUID()
  @IsNotEmpty()
  readonly customerId: string;

  @IsUUID()
  @IsNotEmpty()
  readonly restaurantId: string;


  @IsNotEmpty()
  @ValidateNested({each: true})
  orderItems: OrderItemDto[]

  @IsNotEmpty()
  @ValidateNested()
  readonly address: OrderAddressDto

}


export class ExtendedCreateOrderCommandDto extends CreateOrderCommandDto{

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  readonly price: number;

  @IsNotEmpty()
  @ValidateNested({each: true})
  override readonly orderItems: ExtendedOrderItemDto[]
}

