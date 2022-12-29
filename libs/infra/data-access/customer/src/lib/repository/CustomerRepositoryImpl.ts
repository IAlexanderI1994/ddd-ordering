import {ICustomerRepository} from "./interfaces/ICustomerRepository";
import {Optional} from "@delivery/common/types";
import {Customer} from "@delivery/orders/domain";
import {Injectable} from "@nestjs/common";
import {InjectEntityManager} from "@nestjs/typeorm";
import {EntityManager, Repository} from "typeorm";
import {CustomerEntityView} from "../entity/CustomerEntityView";
import {CustomerDataAccessMapper} from "../mapper/CustomerDataAccessMapper";
import {TransactionsHelper} from "../../../../common/src/lib/helpers/transactions.helper";

@Injectable()
export class CustomerRepositoryImpl implements ICustomerRepository{

  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager
  ) {
  }

  get customerEntityViewRepository(): Repository<CustomerEntityView> {
    const entityManager: EntityManager =  TransactionsHelper.getTransactionEntityManager() || this.entityManager
    return entityManager.getRepository(CustomerEntityView)
  }
  async findCustomer(customerId: string): Promise<Optional<Customer>> {

    const customer =  await this.customerEntityViewRepository.findOneBy({customerId})
    return customer ? CustomerDataAccessMapper.customerEntityToCustomer(customer) : null;
  }

}
