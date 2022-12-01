import axios from 'axios'
import config from '../config'

const magentoApiUrl = config.magento_api_base_url
const headers = config.headers

const getToken = token =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${magentoApiUrl}/V1/t1p/integration/customer/token`,
      method: 'POST',
      headers,
      data: {
        tempToken: token
      }
    }

    axios(params)
      .then(response => {
        const resp = response.data
        resolve(resp)
      })
      .catch(e => {
        reject(e)
      })
  })

export default {
  getToken
}
