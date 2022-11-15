import {
  PAYMENT_GROUP_ID,
  PAYMENT_REQUEST_TOPIC_NAME,
  RESTAURANT_APPROVAL_REQUEST_TOPIC_NAME, RESTAURANT_GROUP_ID
} from "@delivery/orders/messaging";

export function injectEnv(extra?: Record<string, string>) {

  const defaults = {
    [PAYMENT_REQUEST_TOPIC_NAME]: 'payment_request',
    [PAYMENT_GROUP_ID]: 'payment-group',
    [RESTAURANT_APPROVAL_REQUEST_TOPIC_NAME]: 'restaurant_approval_request',
    [RESTAURANT_GROUP_ID]: 'payment_request',

  }

  Object.assign(process.env, defaults, extra)
}
