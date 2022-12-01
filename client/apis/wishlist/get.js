import axios from 'axios'
import Cookie from 'js-cookie'
import { baseUrl } from '../config'

export const get = ({ storeCode }) => {
  const userToken = Cookie.get('user_token')
  const params = {
    url: `${baseUrl}/wishlist/mine`,
    method: 'GET',
    headers: {
      'user-token': userToken,
      'x-store-code': storeCode
    }
  }

  return axios(params).then(response => response.data)
}
