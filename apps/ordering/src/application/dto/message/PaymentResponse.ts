import {IsArray, IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID, Min} from "class-validator";
import {PaymentStatus} from "@ordering/common/domain";

export class PaymentResponseDto {

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
  @IsString()
  private readonly paymentId: string;

  @IsNotEmpty()
  @IsUUID()
  private readonly customerId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  private readonly price: number;

  @IsNotEmpty()
  @IsString()
  private readonly createdAt: string;

  @IsNotEmpty()
  @IsEnum(PaymentStatus)
  private readonly paymentStatus: PaymentStatus;

  @IsArray()
  @IsString({each: true})
  private readonly failureMessages: string[]

}
