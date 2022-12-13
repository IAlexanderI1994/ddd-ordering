import {Entity, PrimaryGeneratedColumn, ViewColumn, ViewEntity} from "typeorm";

@ViewEntity({
  materialized: true,
  name: 'order_customer_m_view',
  expression: `
        SELECT "customerId" AS "id" FROM "orders"
    `
})
export class CustomerEntity {

  @ViewColumn()
  id: string;


  equals(o: object): boolean {
    return o instanceof CustomerEntity && o.id === this.id
  }


}
