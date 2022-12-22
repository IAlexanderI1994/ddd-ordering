import {ICustomerRepository} from "./interfaces/ICustomerRepository";
import {Optional} from "@delivery/common/types";
import {Customer} from "@delivery/orders/domain";
import {Injectable} from "@nestjs/common";
import {InjectRepository as TypeORMRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CustomerEntityView} from "../entity/CustomerEntityView";
import {CustomerDataAccessMapper} from "../mapper/CustomerDataAccessMapper";

@Injectable()
export class CustomerRepositoryImpl implements ICustomerRepository{

  constructor(
    @TypeORMRepository(CustomerEntityView)
    private readonly customerEntityViewRepository: Repository<CustomerEntityView>,


  ) {
  }
  async findCustomer(customerId: string): Promise<Optional<Customer>> {

    const customer =  await this.customerEntityViewRepository.findOneBy({customerId})
    return customer ? CustomerDataAccessMapper.customerEntityToCustomer(customer) : null;
  }

}
