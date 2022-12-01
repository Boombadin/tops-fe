import axios from 'axios'
import config from '../config'

const magentoApiUrl = config.magento_api_base_url
const headers = config.headers

const calculate = (store, data) => axios({
  method: 'POST',
  url: `${magentoApiUrl}/${store}/V1/tops/nyb/calculate`,
  headers: headers,
  data
})

const calculateStep1 = (userToken, store, discountType) => axios({
  method: 'GET',
  url: `${magentoApiUrl}/${store}/V1/carts/mine/nyb/discount/${discountType}`,
  headers: {
    Authorization: `Bearer ${userToken}`
  }
})

const calculateStep2 = (userToken, store, issue) => axios({
  method: 'GET',
  url: `${magentoApiUrl}/${store}/V1/carts/mine/nyb/calculate/additional-voucher/${issue}`,
  headers: {
    Authorization: `Bearer ${userToken}`
  }
})

const selectDiscoutType = (store, userToken) => axios({
  method: 'GET',
  url: `${magentoApiUrl}/${store}/V1/carts/mine/nyb/discount-type`,
  headers: {
    Authorization: `Bearer ${userToken}`
  }
})


export default {
  calculate,
  calculateStep1,
  calculateStep2,
  selectDiscoutType,
}
