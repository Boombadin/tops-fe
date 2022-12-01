import { Payment } from './models/Payment'
import { Product } from './models/Product'

export { withGTMCheckout } from './connectors'
export { analyticsMiddleware } from './analyticsMiddleware'

// Models
export const Model = {
  Payment,
  Product
}
