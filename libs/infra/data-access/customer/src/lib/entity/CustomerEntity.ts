import {Entity, PrimaryGeneratedColumn, ViewEntity} from "typeorm";

@ViewEntity({
  materialized: true,
  name: 'order_customer_m_view',
  schema: 'customers'
})
export class CustomerEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;


  equals(o: object): boolean {
    return o instanceof CustomerEntity && o.id === this.id
  }


}
