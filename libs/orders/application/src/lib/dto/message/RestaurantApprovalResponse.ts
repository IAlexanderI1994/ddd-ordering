import {IsArray, IsEnum, IsNotEmpty, IsString, IsUUID} from "class-validator";
import {OrderApprovalStatus} from "@delivery/common/domain";
import {Expose} from "class-transformer";

export class RestaurantApprovalResponseDto {

  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly id: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly sagaId: string;

  @Expose()
  @IsNotEmpty()
  @IsUUID()
  readonly orderId: string;

  @Expose()
  @IsNotEmpty()
  @IsUUID()
  readonly restaurantId: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly createdAt: string;

  @Expose()
  @IsNotEmpty()
  @IsEnum(OrderApprovalStatus)
  readonly orderApprovalStatus: OrderApprovalStatus;

  @Expose()
  @IsArray()
  @IsString({each: true})
  readonly failureMessages: string[]

}
