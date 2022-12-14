import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({
  name: 'restaurants'
})
export class RestaurantEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column('varchar')
  name: string;

  @Column("boolean")
  active: boolean;

}
