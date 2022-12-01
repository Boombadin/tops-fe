import axios from 'axios';

import { baseUrl } from '../config';

const fetchSuggestions = query => {
  const params = {
    url: `${baseUrl}/search/suggestions`,
    method: 'GET',
    params: {
      query,
    },
  };

  return axios(params);
};

const searchProducts = (
  query,
  sort,
  categoryId,
  page,
  filters,
  userId,
  abtest,
) => {
  const params = {
    url: `${baseUrl}/search/products`,
    method: 'GET',
    params: {
      query,
      sort,
      categoryId,
      page,
      filters,
      userId,
      abtest,
    },
  };

  return axios(params);
};

export default {
  fetchSuggestions,
  searchProducts,
};
