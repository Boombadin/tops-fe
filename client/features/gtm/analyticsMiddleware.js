
import { GTM_FETCH_CHECKOUT } from './redux/gtmActionTypes'
import { Product } from './models/Product'

export const analyticsMiddleware = () => next => action => {
  const { type } = action
  switch (type) {
    case GTM_FETCH_CHECKOUT.SUCCESS:
      dataLayer.push({
        event: 'checkout',
        ecommerce: {
          checkout: {
            actionField: {
              step: 1,
              action: 'checkout'
            },
            products: action.data.map(item => Product(item)),
          }
        }
      })
      break
    default:
  }
  return next(action);
};
