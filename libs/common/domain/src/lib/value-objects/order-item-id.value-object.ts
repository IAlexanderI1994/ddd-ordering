import {BaseId} from "./base-id.value-object";

export class OrderItemId extends BaseId<number> {

  constructor(value) {
    super(value);
  }

}
