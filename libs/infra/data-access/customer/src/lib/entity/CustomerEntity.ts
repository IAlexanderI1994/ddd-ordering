import { Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({
  name: 'customers'
})
export class CustomerEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;


  equals(o: object): boolean {
    return o instanceof CustomerEntity && o.id === this.id
  }


}
