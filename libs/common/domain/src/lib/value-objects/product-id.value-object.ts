import {BaseId} from "./base-id.value-object";

export class ProductId extends BaseId<string> {

  constructor(value) {
    super(value);
  }

}
