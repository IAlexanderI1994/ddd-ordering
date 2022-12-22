import {ViewColumn, ViewEntity} from "typeorm";

@ViewEntity({
  materialized: true,
  name: 'order_customer_m_view',
  expression: `
   SELECT id AS customer_id, name
   FROM customers`
})
export class CustomerEntityView {

  @ViewColumn({name: 'customer_id'})
  customerId: string;

  @ViewColumn()
  name: string;

  equals(o: object): boolean {
    return o instanceof CustomerEntityView && o.customerId === this.customerId
  }


}
