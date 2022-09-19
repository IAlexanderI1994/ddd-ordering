import {IsNotEmpty, IsNumber, IsUUID, Min, ValidateNested} from "class-validator";
import {OrderItemDto} from "./OrderItemDto";
import {OrderAddressDto} from "./OrderAddress";

export class CreateOrderDto {

  @IsUUID()
  @IsNotEmpty()
  private readonly customerId: string;

  @IsUUID()
  @IsNotEmpty()
  private readonly restaurantId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  private readonly price: number;

  @IsNotEmpty()
  @ValidateNested({each: true})
  private readonly orderItems: OrderItemDto[]

  @IsNotEmpty()
  @ValidateNested()
  private readonly address: OrderAddressDto


}

