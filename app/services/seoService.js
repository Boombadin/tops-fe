import axios from 'axios';
import { get } from 'lodash';
import config from '../config';
import urlRewrite from './urlRewrite';
import { responseMeta } from '../utils/responseMeta';
import { baseUrl } from '../../client/apis/config';

// Constants
const V1 = '/V1';
const { headers } = config;
const ENTITY_TYPE = {
  PRODUCT: 'product',
  CATEGORY: 'category',
  CMSPAGE: 'cms-page',
  CUSTOM: 'custom',
};

// Endpoints
const MAGENTO_API = (store, version, path) =>
  `${config.magento_api_base_url}/${store}${version}${path}`;
const MAGENTO_ENDPOINT_URL_REWRITE_PRODUCT = (code, slug) =>
  MAGENTO_API(code, V1, `/products/url-key/${encodeURIComponent(slug)}`);
const MAGENTO_ENDPOINT_URL_REWRITE_CATEGORY = (code, id) =>
  MAGENTO_API(code, V1, `/categories/${id}`);
const MAGENTO_ENDPOINT_URL_REWRITE_CMS_PAGE = (code, id) =>
  MAGENTO_API(code, V1, `/cmsPage/${id}`);

const getUrlRewriteProduct = (code, slug) =>
  axios({
    url: MAGENTO_ENDPOINT_URL_REWRITE_PRODUCT(code, slug),
    method: 'GET',
    headers,
  });

const getUrlRewriteCategory = (code, id) =>
  axios({
    url: MAGENTO_ENDPOINT_URL_REWRITE_CATEGORY(code, id),
    method: 'GET',
    headers,
  });

const getUrlRewriteCMSPage = (code, id) =>
  axios({
    url: MAGENTO_ENDPOINT_URL_REWRITE_CMS_PAGE(code, id),
    method: 'GET',
    headers,
  });

const getUrlRewritePath = slug =>
  axios({
    url: `${baseUrl}/url-rewrite${slug}`,
    method: 'GET',
    headers,
  });

const getSeo = async (code, slug, locate) => {
  if (code && slug) {
    try {
      const entity = await urlRewrite.get(code, slug);
      if (entity.data.entity_type === ENTITY_TYPE.CATEGORY) {
        const response = await getUrlRewriteCategory(
          code,
          entity.data.entity_id,
        );
        const formatData = responseMeta(response.data, locate);
        return formatData;
      } else if (entity.data.entity_type === ENTITY_TYPE.CMSPAGE) {
        const response = await getUrlRewriteCMSPage(
          code,
          entity.data.entity_id,
        );
        const formatData = response.data;
        return formatData;
      } else if (entity.data.entity_type === ENTITY_TYPE.CUSTOM) {
        return { redirect: 301, url_redirect: entity.data.target_path };
      }

      const response = await getUrlRewriteProduct(code, slug);
      const formatData = responseMeta(response.data, locate);
      formatData.entity = 'product';
      return formatData;
    } catch (e) {
      return { pageNotFound: true };
    }
  }
  return {};
};

const getUrlRedirect = async (slug, path = 'p') => {
  const newSlug = slug.replace(`${path}/`, `${path}%2F`);
  if (slug) {
    try {
      const response = await getUrlRewritePath(newSlug);
      return `/${get(response.data, 'pathObj.target_path', '')}`;
    } catch (e) {
      return slug;
    }
  }
  return slug;
};

export default {
  getUrlRewriteProduct,
  getUrlRewriteCategory,
  getSeo,
  getUrlRedirect,
};
