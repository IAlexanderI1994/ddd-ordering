import {IsArray, IsEnum, IsNotEmpty, IsString, IsUUID} from "class-validator";
import {OrderStatus} from "@delivery/common/domain";

export class TrackOrderResponseDto {
  @IsUUID()
  @IsNotEmpty()
  private readonly orderTrackingId: string;

  @IsEnum(OrderStatus)
  @IsNotEmpty()
  private readonly orderStatus: OrderStatus;

  @IsArray()
  @IsString({each: true})
  private readonly failureMessages: string[]

}
