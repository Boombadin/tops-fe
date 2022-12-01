import axios from 'axios';
import { baseUrl } from '../config';

const login = data => {
  const params = {
    url: `${baseUrl}/login`,
    method: 'POST',
    data: {
      username: data.email,
      password: data.password,
    },
  };

  return axios(params);
};

const socialLogin = data => {
  const params = {
    url: `${baseUrl}/socialLogin`,
    method: 'POST',
    params: {
      token: data.token,
      provider: data.provider,
    },
  };

  return axios(params);
};

export default {
  login,
  socialLogin,
};
