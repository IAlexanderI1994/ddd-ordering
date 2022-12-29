import {getDatasource} from "@delivery/infra/data-access/config";
import {TransactionsHelper} from "../helpers/transactions.helper";



export function Transactional(): MethodDecorator {

  return (
    _: unknown,
    methodName: string | symbol,
    descriptor: TypedPropertyDescriptor<unknown>,
  ) => {
    const originalMethod = descriptor.value as () => unknown;

    descriptor.value = new Proxy(originalMethod, {
      async apply(target: any, thisArg: any, argArray: any[]): Promise<any> {


        const dataSource = await getDatasource()
        await dataSource.manager.transaction((entityManager) => {

          return TransactionsHelper.transactionStorage.run(entityManager, () => {
            return target.apply(thisArg, argArray)
          });

        });
      }
    })
  }

}
