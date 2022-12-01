import axios from 'axios'
import { baseUrl } from '../config'

const getBannerByName = name => {
  return axios({
    url: `${baseUrl}/banners`,
    params: {
      name: name
    }
  })
    .then(value => value.data)
    .catch(err => {
      return null
    })
}

const getBannerByCategory = category => {
  return axios({
    url: `${baseUrl}/banners`,
    params: {
      category: category
    }
  })
    .then(value => value.data)
    .catch(err => {
      return null
    })
}

export default {
  getBannerByName,
  getBannerByCategory
}
