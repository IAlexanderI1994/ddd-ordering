import {IsEnum, IsNotEmpty, IsString, IsUUID} from "class-validator";
import {OrderStatus} from "@ordering/common/domain";

export class CreateOrderResponseDto {

  @IsNotEmpty()
  @IsUUID()
  readonly orderTrackingId: string

  @IsEnum(OrderStatus)
  @IsNotEmpty()
  readonly orderStatus: OrderStatus;

  @IsNotEmpty()
  @IsString()
  readonly message: string;

}
