import {BaseId} from "./base-id.value-object";

export class CustomerId extends BaseId<string> {

  constructor(value) {
    super(value);
  }

}
