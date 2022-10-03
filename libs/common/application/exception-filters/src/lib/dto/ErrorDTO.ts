import {IsNotEmpty, IsString, ArrayNotEmpty, IsArray} from "class-validator";

export class ErrorDTO {

  @IsNotEmpty()
  @IsString()
  readonly timestamp: string;

  @IsArray()
  @ArrayNotEmpty()
  readonly errors: unknown[];
}
