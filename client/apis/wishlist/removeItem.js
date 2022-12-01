import axios from 'axios'
import Cookie from 'js-cookie'
import { baseUrl } from '../config'

export const removeItem = ({ productId, storeCode }) => {
  const userToken = Cookie.get('user_token')

  const params = {
    url: `${baseUrl}/wishlist/items/${productId}`,
    method: 'DELETE',
    headers: {
      'user-token': userToken,
      'x-store-code': storeCode
    }
  }

  return axios(params).then(response => response.data)
}
