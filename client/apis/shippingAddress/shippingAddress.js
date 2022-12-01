import axios from 'axios'
import { baseUrl } from '../config'

const setShippingLocation = (regionId, districtId, subdistrictId, zipcode, customerId) => {
  const options = {
    method: 'POST',
    url: `${baseUrl}/shipping/current`,
    data: {
      regionId: regionId,
      districtId: districtId,
      subdistrictId: subdistrictId,
      zipcode: zipcode,
      customerId: customerId
    }
  }
  
  return axios(options)
    .then(response => response.data)
    .catch(e => {
      throw e
    })
}

export default {
  setShippingLocation
}