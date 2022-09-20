import {IsNotEmpty, IsString, Max} from "class-validator";

export class OrderAddressDto {

  @IsNotEmpty()
  @IsString()
  @Max(50)
  street: string

  @IsNotEmpty()
  @IsString()
  @Max(10)
  postalCode: string

  @IsNotEmpty()
  @IsString()
  @Max(50)
  city: string


}
