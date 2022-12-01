import axios from 'axios'
import Cookie from 'js-cookie'
import { baseUrl } from '../config'

export const getProducts = ({ storeCode, qry }) => {
  const userToken = Cookie.get('user_token')
  const params = {
    url: `${baseUrl}/wishlist/mine/products?${qry}`,
    method: 'GET',
    headers: {
      'user-token': userToken,
      'x-store-code': storeCode
    },

  }

  return axios(params).then(response => response.data)
}
