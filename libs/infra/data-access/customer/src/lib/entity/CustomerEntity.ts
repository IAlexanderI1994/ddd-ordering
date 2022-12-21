import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({
  name: 'customers'
})
export class CustomerEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column('varchar')
  name: string;


}
