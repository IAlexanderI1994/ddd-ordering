import {
  PAYMENT_GROUP_ID,
  PAYMENT_REQUEST_TOPIC_NAME,
  RESTAURANT_APPROVAL_REQUEST_TOPIC_NAME, RESTAURANT_GROUP_ID
} from "@delivery/orders/messaging";
import {DB_HOST, DB_NAME, DB_PORT, DB_PWD, DB_TYPE, DB_USERNAME} from "@delivery/infra/data-access/config";

export function injectEnv(extra?: Record<string, string>) {

  const defaults = {
    [PAYMENT_REQUEST_TOPIC_NAME]: 'payment_request',
    [PAYMENT_GROUP_ID]: 'payment-group',
    [RESTAURANT_APPROVAL_REQUEST_TOPIC_NAME]: 'restaurant_approval_request',
    [RESTAURANT_GROUP_ID]: 'payment_request',
    [DB_TYPE]: 'postgres',
    [DB_HOST]: 'localhost',
    [DB_PORT]: '5432',
    [DB_USERNAME]: 'root',
    [DB_PWD]: 'root',
    [DB_NAME]: 'test',
  }

  Object.assign(process.env, defaults, extra)
}
