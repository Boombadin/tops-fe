import { isFuture, isPast } from 'date-fns';
import { find, get } from 'lodash';
import { getTranslate } from 'react-localize-redux';

import Exploder from '../../client/utils/mcaex';
import { formatPrice } from '../../client/utils/price';
import metaDataJSON from '../constants/meta';
import { staticRoutesQuery } from '../constants/seo';
import categoryService from '../services/categoryService';
import productService from '../services/productService';
import seoService from '../services/seoService';

const env = process.env.ENV;
let linkPath = 'tops-staging';
if (env === 'uat') {
  linkPath = 'tops-uat';
} else if (env === 'prod') {
  linkPath = 'tops';
}

export const textMetaTitle = title => (title ? `<title>${title}</title>` : '');
export const textMetaTags = (metaDescription, metaKeywords) => `
${metaDescription && `<meta name="description" content="${metaDescription}" />`}
${metaKeywords && `<meta name="keywords" content="${metaKeywords}" />`}
${
  process.env.ENV !== 'prod'
    ? '<META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">'
    : ''
}`;

export const textOgMetaTitle = title =>
  title ? `<meta property="og:title" content="${title}" />` : '';
export const textOgMetaTags = description =>
  description
    ? `<meta property="og:description" content="${description}" />`
    : '';
// export const imgOgMetaTags = ogImg => (ogImg ? `<meta property="og:image" content="https://res.cloudinary.com/dgfakeunx/image/fetch/c_scale,q_auto,w_400/${ogImg}" />` : '');
export const imgOgMetaTags = ogImg =>
  ogImg ? `<meta property="og:image" content="${ogImg}" />` : '';
export const textOgUrl = ogUrl =>
  ogUrl ? `<meta property="og:url" content="${ogUrl}" />` : '';
export const textOgType = ogType =>
  ogType ? `<meta property="og:type" content="${ogType}" />` : '';
export const textFbAppID = appID =>
  appID ? `<meta property="fb:app_id" content="${appID}" />` : '';
export const branchProduct = productSku =>
  productSku &&
  `<meta name="branch:deeplink:$deeplink_path" content="${linkPath}://detail?sku=${productSku}" />
  <meta name="branch:deeplink:$ios_deeplink_path" content="${linkPath}://detail?sku=${productSku}" />
  <meta name="branch:deeplink:$android_deeplink_path" content="tops://detail?sku=${productSku}"/>`;
export const branchCategory = categoryId =>
  categoryId &&
  `<meta name="branch:deeplink:$deeplink_path" content="${linkPath}://category?category_id=${categoryId}" />
  <meta name="branch:deeplink:$ios_deeplink_path" content="${linkPath}://category?category_id=${categoryId}" />
  <meta name="branch:deeplink:$android_deeplink_path" content="tops://category?category_id=${categoryId}"/>`;

export const metaData = async (code, slug, locate, store) => {
  let metaTitle = '';
  let metaTags = '';
  let metaOgTitle = '';
  let metaOgTags = '';
  let metaOgTagsImg = '';
  let metaFbAppID = '';
  let metaType = '';
  let metaUrl = '';
  let pageNotFound = false;
  let microDataName = '';
  let microDataImg = '';
  let microDataDescription = '';
  let microDataPrice = '';
  let metaBranchProduct = '';
  let metaBranchCategory = '';

  if (code && slug) {
    try {
      const meta = await seoService.getSeo(code, slug, locate);
      if (meta.redirect === 301) {
        return meta;
      }
      const cateData = await categoryService.get(slug, code);
      const urlPath = find(cateData.items, url => url.url_path === slug);
      let microData = await productService.getOne(code, slug);
      let dataName = '';
      let dataImg = '';
      let dataDescription = '';
      let dataPrice = '';
      if (get(microData, 'id', 0)) {
        if (get(microData, 'custom_attributes', '')) {
          microData = Exploder.explode(microData);
        }
        const translate = getTranslate(get(store, 'locale', {}));
        const specialPrice =
          get(microData, 'special_price', '0.00') &&
          Number(get(microData, 'special_price', '0.00')) !== 0
            ? formatPrice(get(microData, 'special_price', '0.00'))
            : null;
        const price = formatPrice(get(microData, 'price', '0.00'));

        let isInRange = false;
        if (get(microData, 'extension_attributes.promotion.end_date', '')) {
          isInRange = get(
            microData,
            'extension_attributes.promotion.end_date',
            '',
          )
            ? isFuture(
                get(microData, 'extension_attributes.promotion.end_date', ''),
              )
            : true;
        }

        const showSpecialPrice =
          specialPrice && specialPrice !== price && isInRange;
        const brandName = get(
          find(
            get(microData, 'custom_attributes_option'),
            attr => attr.attribute_code === 'brand_name',
          ),
          'value',
          '',
        );

        dataName = get(microData, 'name', '');
        dataImg = `${get(
          store,
          'storeConfig.current.base_media_url',
          '',
        )}catalog/product${get(microData, 'image', '')}`;
        dataDescription =
          get(microData, 'meta_description', '') ||
          `${translate('product.meta.shop_online')} ${get(
            microData,
            'name',
            '',
          )} ${translate('product.meta.from')} ${brandName || ''} ${translate(
            'product.meta.tops_online',
          )}`;
        dataPrice = showSpecialPrice ? specialPrice : price;
      }

      const title = get(meta, 'meta_title', '');
      const metaDescription = get(meta, 'meta_description', '');
      const metaKeywords = get(
        meta,
        'meta_keywords',
        get(meta, 'meta_keyword', ''),
      );
      const metaOgImg = get(meta, 'image', '');
      const type = get(meta, 'entity', 'website');
      const fbAppID = get(process, 'env.FACEBOOK_ID', '');
      const url = get(meta, 'og_url', '/');
      const baseUrl = get(process, 'env.BASE_URL', '');
      const productSku = microData?.sku;
      const categoryId = urlPath?.entity_id;
      metaTitle = textMetaTitle(title);
      metaTags = textMetaTags(metaDescription, metaKeywords);
      metaOgTitle = textOgMetaTitle(title);
      metaOgTags = textOgMetaTags(metaDescription);
      metaFbAppID = textFbAppID(fbAppID);
      metaUrl = textOgUrl(`${baseUrl}${url}`);
      metaType = textOgType(type);
      metaOgTagsImg = metaOgImg.includes('cms/')
        ? imgOgMetaTags(
            `${store.storeConfig.current.base_media_url}${metaOgImg}`,
          )
        : imgOgMetaTags(
            `${store.storeConfig.current.base_media_url}catalog/product${metaOgImg}`,
          );
      pageNotFound = meta.pageNotFound;
      microDataName = dataName;
      microDataImg = dataImg;
      microDataDescription = dataDescription;
      microDataPrice = dataPrice;
      productSku && (metaBranchProduct = branchProduct(productSku));
      categoryId && (metaBranchCategory = branchCategory(categoryId));
    } catch (e) {
      metaTitle = '';
      metaTags = '';
    }
  }
  return {
    metaTitle,
    metaTags,
    metaOgTitle,
    metaOgTags,
    metaOgTagsImg,
    metaFbAppID,
    metaType,
    metaUrl,
    microDataName,
    microDataImg,
    microDataDescription,
    microDataPrice,
    pageNotFound,
    metaBranchProduct,
    metaBranchCategory,
  };
};
export const mockMetaData = (slug, locate, topic, params) => {
  let metaTitle = '';
  let metaTags = '';
  let meta = {};
  let metaOgTitle = '';
  let metaOgTags = '';
  let metaOgTagsImg = '';
  let metaFbAppID = '';
  let metaType = 'website';
  let metaUrl = '';

  if (staticRoutesQuery.includes(slug) && topic) {
    meta = get(metaDataJSON, `${locate}.${slug}.topic.${topic}`, {});
  } else {
    meta = get(metaDataJSON, `${locate}.${slug}`, {});
  }
  const title = get(meta, 'meta_title', '');
  const metaDescription = get(meta, 'meta_description', '');
  const metaKeywords = get(meta, 'meta_keywords', '');
  const metaOgImg = get(meta, 'image', '');
  const type = get(meta, 'entity', 'website');
  const fbAppID = get(process, 'env.FACEBOOK_ID', '');
  const url = get(meta, 'og_url', '/');
  const baseUrl = get(process, 'env.BASE_URL', '');

  metaTitle = textMetaTitle(title);
  metaTags = textMetaTags(metaDescription, metaKeywords);
  metaFbAppID = textFbAppID(fbAppID);
  metaUrl = textOgUrl(`${baseUrl}${url}`);
  metaType = textOgType(type);
  metaOgTitle = textOgMetaTitle(title);
  metaOgTags = textOgMetaTags(metaDescription);
  metaOgTagsImg = imgOgMetaTags(metaOgImg);

  return {
    metaTitle,
    metaTags,
    metaOgTitle,
    metaOgTags,
    metaOgTagsImg,
    metaFbAppID,
    metaType,
    metaUrl,
  };
};
