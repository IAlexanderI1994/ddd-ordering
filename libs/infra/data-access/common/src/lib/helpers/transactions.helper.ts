import {EntityManager} from "typeorm";
import {AsyncLocalStorage} from "async_hooks";

export class TransactionsHelper {
  static transactionStorage: AsyncLocalStorage<EntityManager> = new AsyncLocalStorage<EntityManager>();

  static getTransactionEntityManager(): EntityManager | null {
    return TransactionsHelper.transactionStorage.getStore()
  }
}
