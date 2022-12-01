import axios from 'axios'
import { baseUrl } from '../config'

const forgotPassword = email =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${baseUrl}/account/forgot-password`,
      method: 'PUT',
      data: {
        email
      }
    }

    return axios(params)
      .then(res => resolve(res))
      .catch(e => reject(e))
  })

const resetPassword = (resetToken, email, newPassword) =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${baseUrl}/account/reset-password`,
      method: 'POST',
      data: {
        resetToken,
        email,
        newPassword
      }
    }

    return axios(params)
      .then(res => resolve(res))
      .catch(e => reject(e))
  })

export default {
  forgotPassword,
  resetPassword
}
