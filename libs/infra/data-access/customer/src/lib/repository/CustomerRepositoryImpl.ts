import {ICustomerRepository} from "./interfaces/ICustomerRepository";
import {Optional} from "@ordering/common/types";
import {Customer} from "@ordering/orders/domain";
import {Injectable} from "@nestjs/common";
import {InjectRepository as TypeORMRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CustomerEntity} from "../entity/CustomerEntity";
import {CustomerDataAccessMapper} from "../mapper/CustomerDataAccessMapper";

@Injectable()
export class CustomerRepositoryImpl implements ICustomerRepository{

  constructor(
    @TypeORMRepository(CustomerEntity)
    private customerEntityRepository: Repository<CustomerEntity>
  ) {
  }
  async findCustomer(customerId: string): Promise<Optional<Customer>> {
    const customer =  await this.customerEntityRepository.findOneBy({id: customerId})
    return customer ? CustomerDataAccessMapper.customerEntityToCustomer(customer) : null;
  }

}
