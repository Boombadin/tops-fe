import axios from 'axios'
import { baseUrl } from '../config'

export const addItem = ({ productId, storeCode, storeId }) => {
  const params = {
    url: `${baseUrl}/wishlist/items`,
    method: 'POST',
    data: {
      item: {
        productId,
        storeId
      },
      storeId
    }
  }
  
  return axios(params)
    .then(response => response.data)
    .catch((err) => {
      return null
    })
}
