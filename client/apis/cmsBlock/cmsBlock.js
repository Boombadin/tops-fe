import axios from 'axios'
import { baseUrl } from '../config'

const getAll = filters =>
  new Promise((resolve, reject) => {
    axios(`${baseUrl}/cmsblock/${filters}`)
      .then(response => {
        resolve(response.data)
      })
      .catch(e => {
        reject(e)
      })
  })

export default {
  getAll
}
