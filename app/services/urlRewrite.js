import axios from 'axios'
import config from '../config'

const magentoApiUrl = config.magento_api_base_url
const headers = config.headers

const get = (store, path) => {
  const params = {
    url: `${magentoApiUrl}/${store}/V1/url-rewrite/${encodeURIComponent(path)}`,
    method: 'GET',
    headers
  }

  return axios(params)
}

export default {
  get
}
