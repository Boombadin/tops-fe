import axios from 'axios';
import { stringify } from 'query-string';

import { baseUrl } from '@client/apis/config';

let cancel;

const get = search => {
  if (cancel !== undefined) cancel();

  let url = `${baseUrl}/products`;

  if (search) {
    url = `${url}?${search}`;
  }

  return axios({ url: url })
    .then(response => {
      return response.data;
    })
    .catch(e => {
      return null;
    });
};

const getV2 = search => {
  let url = `${baseUrl}/products`;

  if (search) {
    url = `${url}?${search}`;
  }

  return axios({
    url: url,
  })
    .then(response => response.data)
    .catch(e => {
      return null;
    });
};

const getPromotion = search => {
  if (cancel !== undefined) cancel();

  let url = `${baseUrl}/products/promotions/`;

  if (search) {
    url = `${url}?${search}`;
  }

  return axios({ url: url })
    .then(response => {
      return response.data;
    })
    .catch(e => {
      return null;
    });
};

const getByCampaignCatalog = sku => {
  const url = `${baseUrl}/products/campaignCatalog?productSku=${sku}`;
  return axios({
    url: url,
  })
    .then(response => response.data)
    .catch(e => {
      return null;
    });
};

const getByCategorySet = search => {
  if (cancel !== undefined) cancel();

  const url = `${baseUrl}/products/set?${search}`;
  return axios({ url: url })
    .then(response => response.data)
    .catch(e => {
      return null;
    });
};

const getOne = slug =>
  new Promise((resolve, reject) => {
    if (cancel !== undefined) cancel();

    const url = `${baseUrl}/products/${slug}`;

    axios({ url })
      .then(response => {
        resolve(response.data);
      })
      .catch(e => {
        reject(e);
      });
  });

const getByFilter = (key, slug, condition, sort) => {
  const url = `${baseUrl}/products/${key}/${slug}/${condition}`;
  const params = {
    sort,
  };

  return axios({ url, params })
    .then(response => response.data)
    .catch(e => null);
};

const getRelative = sku => {
  const url = `${baseUrl}/relative-products/${sku}`;
  const method = 'GET';

  return axios({ url, method })
    .then(response => response.data)
    .catch(e => null);
};

const getBySkus = ({ storeCode, skus }) => {
  const headers = {
    'cache-control': 'no-cache, no-store',
    pragma: 'no-cache',
  };

  if (storeCode) {
    headers['x-store-code'] = storeCode;
  }

  const qry = stringify({ skus });

  return axios({
    url: `${baseUrl}/products-by-skus?${qry}`,
    headers,
  })
    .then(response => response.data)
    .catch(() => null);
};

const getCatalogServiceBySku = ({ storeCode, skus, plpFilter = false }) => {
  const headers = {
    'cache-control': 'no-cache, no-store',
    pragma: 'no-cache',
  };

  if (storeCode) {
    headers['x-store-code'] = storeCode;
  }

  return axios({
    url: `${baseUrl}/products/catalog-service?skus=${skus.toString()}&plpFilter=${plpFilter}`,
    headers,
  })
    .then(response => response.data)
    .catch(e => null);
};

const getSimilarity = (sku, store, userId, isGoogleOptimizeSimilarity) => {
  const param = {
    url: `${baseUrl}/product/similarity`,
    method: 'GET',
    params: {
      sku,
      store,
      userId,
      isGoogleOptimizeSimilarity,
    },
  };

  return axios(param)
    .then(response => response.data)
    .catch(e => null);
};

const getAssociation = (sku, store, userId, isGoogleOptimizeAssociation) => {
  const param = {
    url: `${baseUrl}/product/association`,
    method: 'GET',
    params: {
      sku,
      store,
      userId,
      isGoogleOptimizeAssociation,
    },
  };

  return axios(param)
    .then(response => response.data)
    .catch(e => null);
};

const getRecommendPersonal = product_recommend => {
  const param = {
    url: `${baseUrl}/product/recommendations`,
    method: 'GET',
    params: {
      product_recommend: product_recommend,
    },
  };

  return axios(param)
    .then(response => response.data)
    .catch(e => null);
};

const getRecommendPersonalWithItem = (productRecommend, isGoogleOptimize) => {
  const param = {
    url: `${baseUrl}/product/recommendations/items`,
    method: 'GET',
    params: {
      productRecommend,
      isGoogleOptimize,
    },
  };

  return axios(param)
    .then(response => response.data)
    .catch(e => null);
};

export default {
  get,
  getV2,
  getOne,
  getByCategorySet,
  getByFilter,
  getRelative,
  getBySkus,
  getSimilarity,
  getAssociation,
  getRecommendPersonal,
  getByCampaignCatalog,
  getPromotion,
  getCatalogServiceBySku,
  getRecommendPersonalWithItem,
};
