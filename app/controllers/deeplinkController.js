import axios from 'axios'
import { responseSuccess, responseError } from '../utils/codeStatus'

const deeplink = async (req, res) => {
  const data = req.body
  try {
    const response = await axios({
      method: 'POST',
      url: 'https://api.branch.io/v1/url',
      data
    })
    responseSuccess(200, res, response.data)
  } catch (e) {
    responseError(res, e)
  }
}

export default {
  deeplink
}
