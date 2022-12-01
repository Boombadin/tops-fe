import axios from 'axios';
import { baseUrl } from '../config';

const create = customer => {
  const params = {
    url: `${baseUrl}/register`,
    method: 'POST',
    data: {
      customer: customer,
      subscribe: true,
    },
  };

  return axios(params);
};

const isEmailAvailable = email => {
  const params = {
    url: `${baseUrl}/isEmailAvailable/${email}`,
    method: 'GET',
  };

  return axios(params);
};

export default {
  create,
  isEmailAvailable,
};
