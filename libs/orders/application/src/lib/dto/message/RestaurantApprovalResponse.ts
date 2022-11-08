import {IsArray, IsEnum, IsNotEmpty, IsString, IsUUID} from "class-validator";
import {OrderApprovalStatus} from "@ordering/common/domain";

export class RestaurantApprovalResponseDto {

  @IsNotEmpty()
  @IsString()
  private readonly id: string;

  @IsNotEmpty()
  @IsString()
  private readonly sagaId: string;

  @IsNotEmpty()
  @IsUUID()
  private readonly orderId: string;

  @IsNotEmpty()
  @IsUUID()
  private readonly restaurantId: string;

  @IsNotEmpty()
  @IsString()
  private readonly createdAt: string;

  @IsNotEmpty()
  @IsEnum(OrderApprovalStatus)
  private readonly orderApprovalStatus: OrderApprovalStatus;

  @IsArray()
  @IsString({each: true})
  private readonly failureMessages: string[]

}
