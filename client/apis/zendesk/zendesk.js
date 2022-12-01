import axios from 'axios'
import { baseUrl } from '../config'

export const sendForm = data => {
  const params = {
    url: `${baseUrl}/zendesk-ticket`,
    method: 'POST',
    data
  }

  return axios(params)
    .then(response => response.data)
    .catch(e => {
      return null
    })
}

export default {
  sendForm,
}
