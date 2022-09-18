import {IsEnum, IsNotEmpty, IsString, IsUUID} from "class-validator";
import {OrderStatus} from "@ordering/common/domain";

export class CreateOrderResponseDto {

  @IsNotEmpty()
  @IsUUID()
  private readonly orderTrackingId: string

  @IsEnum(OrderStatus)
  @IsNotEmpty()
  private readonly orderStatus: OrderStatus;

  @IsNotEmpty()
  @IsString()
  private readonly message: string;

}
