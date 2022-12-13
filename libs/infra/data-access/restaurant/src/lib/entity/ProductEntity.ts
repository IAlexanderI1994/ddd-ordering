import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({
  name: 'products'
})
export class ProductEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column('varchar')
  name: string;

  @Column('float')
  price: number

  @Column("boolean")
  available: boolean;

}
