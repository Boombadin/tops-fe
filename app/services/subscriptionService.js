import axios from 'axios'
import config from '../config'

const magentoApiUrl = config.magento_api_base_url
const headers = config.headers

const addGuestSubscription = email => {
  const params = {
    url: `${magentoApiUrl}/V1/GuestSubscriber/${email}`,
    method: 'POST',
    headers
  };

  return axios(params)
    .then(r => r.data)
}

export default {
  addGuestSubscription
}
