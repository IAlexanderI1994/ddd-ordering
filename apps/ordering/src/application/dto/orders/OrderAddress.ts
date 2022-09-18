import {IsNotEmpty, IsString, Max} from "class-validator";

export class OrderAddressDto {

  @IsNotEmpty()
  @IsString()
  @Max(50)
  address: string

  @IsNotEmpty()
  @IsString()
  @Max(10)
  postalCode: string

  @IsNotEmpty()
  @IsString()
  @Max(50)
  city: string


}
