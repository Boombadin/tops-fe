import axios from 'axios'
import { baseUrl } from '../config'

const addGuestSubscription = email =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${baseUrl}/subscription/guest`,
      method: 'POST',
      data: {
        email
      }
    };

    axios(params)
      .then(response => {
        resolve(response.data)
      })
      .catch(e => {
        reject(e)
      })
  })

export default {
  addGuestSubscription
}
