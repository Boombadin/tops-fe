import axios from 'axios';
import { baseUrl } from '../config';

const get = (store, requestPath) => {
  return axios({ url: `${baseUrl}/url-rewrite/${requestPath}` })
    .then((response) => response.data)
    .catch((e) => {
      return e
    });
}
  
export default {
  get
};
