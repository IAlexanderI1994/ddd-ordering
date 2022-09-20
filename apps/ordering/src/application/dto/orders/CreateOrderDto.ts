import {IsNotEmpty, IsNumber, IsUUID, Min, ValidateNested} from "class-validator";
import {OrderItemDto} from "./OrderItemDto";
import {OrderAddressDto} from "./OrderAddress";

export class CreateOrderDto {

  @IsUUID()
  @IsNotEmpty()
  readonly customerId: string;

  @IsUUID()
  @IsNotEmpty()
  readonly restaurantId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  readonly price: number;

  @IsNotEmpty()
  @ValidateNested({each: true})
  readonly orderItems: OrderItemDto[]

  @IsNotEmpty()
  @ValidateNested()
  readonly address: OrderAddressDto


}

