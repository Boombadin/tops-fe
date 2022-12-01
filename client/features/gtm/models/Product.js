import { find, get as prop, map } from 'lodash';
import { setModel } from '@client/utils/Model';
export const Product = data => {
  const { string } = setModel(data);
  const dataSpecialPrice = parseFloat(string('special_price'));
  let dataPrice = string('price');
  if (dataSpecialPrice > 0) {
    dataPrice = string('special_price');
  }
  return {
    id: string('sku'),
    name: string('extension_attributes.gtm_data.product_name_en'),
    price: dataPrice,
    category: string('extension_attributes.gtm_data.category_en'),
    brand: string('extension_attributes.gtm_data.brand_en'),
    quantity: 1,
    discount_price: string('price_saving'),
    original_price: string('price'),
  };
};
export const ProductWithPriceInclTax = data => {
  const { string } = setModel(data);
  const dataSpecialPrice = parseFloat(string('special_price'));
  let dataPrice = string('price');
  if (dataSpecialPrice > 0) {
    dataPrice = string('special_price');
  }

  const discountPrice =
    string('original_price') - string('price_incl_tax') ||
    string('price') - dataPrice;
  return {
    id: string('sku'),
    name: string('extension_attributes.gtm_data.product_name_en'),
    price: dataPrice,
    category: string('extension_attributes.gtm_data.category_en'),
    brand: string('extension_attributes.gtm_data.brand_en'),
    quantity: string('qty', 1),
    discount_price: (discountPrice > 0 ? discountPrice : 0).toString(),
    original_price: string('original_price') || string('price'),
  };
};
export const ProductReorderWithPriceInclTax = data => {
  const { string } = setModel(data);
  return {
    id: string('sku'),
    name: string('extension_attributes.gtm_data.product_name_en'),
    price: string('price_incl_tax'),
    category: string('extension_attributes.gtm_data.category_en'),
    brand: string('extension_attributes.gtm_data.brand_en'),
    quantity: string('qty', 1),
  };
};
export const ProductListPriceInclTax = data => {
  return map(data, i => ({
    id: prop(i, 'sku'),
    name: prop(i, 'extension_attributes.gtm_data.product_name_en', ''),
    price: prop(i, 'price_incl_tax'),
    category: prop(i, 'extension_attributes.gtm_data.category_en', ''),
    brand: prop(i, 'extension_attributes.gtm_data.brand_en', ''),
    quantity: prop(i, 'qty', 1),
    discount_price: i.original_price - i.price_incl_tax || 0,
    original_price: prop(i, 'original_price'),
  }));
};
export const ProductImpression = (data, section) => {
  const ecImpressions = ['ecommerce.impressions.push'];
  const result = map(data, (i, index) => ({
    name: prop(i, 'extension_attributes.gtm_data.product_name_en', ''),
    id: prop(i, 'sku'),
    price: prop(i, 'special_price')
      ? prop(i, 'special_price')
      : prop(i, 'price'),
    category: prop(i, 'extension_attributes.gtm_data.category_en', ''),
    brand: prop(i, 'extension_attributes.gtm_data.brand_en', ''),
    postion: prop(i, 'order') ? prop(i, 'order') + 1 : index + 1,
    list: section,
  }));
  return ecImpressions.concat(result);
};
export const ProductImpressionAttr = (data, section, orderItem) => {
  const { string } = setModel(data);
  const dataSpecialPrice = parseFloat(string('special_price'));
  let dataPrice = string('price');
  if (dataSpecialPrice > 0) {
    dataPrice = string('special_price');
  }
  const dataAttr = {
    'data-pid': string('sku'),
    'data-productname': string('extension_attributes.gtm_data.product_name_en'),
    'data-productprice': dataPrice,
    'data-productcategory': string('extension_attributes.gtm_data.category_en'),
    'data-productbrand': string('extension_attributes.gtm_data.brand_en'),
    'data-productoriginalprice': string('price'),
    'data-position': orderItem + 1,
  };
  if (section) {
    dataAttr['data-productsection'] = section;
  }
  return dataAttr;
};
export const ProductEmarsys = data => {
  const { string } = setModel(data);
  return {
    item: string('sku'),
    price: string('price_incl_tax'),
    quantity: string('qty', 1),
    name: string('name'),
    category: string('extension_attributes.gtm_data.category_en'),
  };
};
export const ProductNoQty = data => {
  const { string, array } = setModel(data);
  let specialPrice;
  if (string('special_price')) {
    specialPrice = prop(data, 'special_price');
  } else {
    specialPrice = parseFloat(
      prop(
        find(array('custom_attributes', []), val => {
          return val.attribute_code === 'special_price';
        }),
        'value',
        0,
      ),
      0,
    );
  }
  const originalPrice = prop(data, 'original_price', prop(data, 'price'));
  const discountPrice = string('special_price')
    ? originalPrice - specialPrice
    : 0;
  return {
    id: string('sku'),
    name: string('extension_attributes.gtm_data.product_name_en'),
    price: (specialPrice > 0 ? specialPrice : 0) || originalPrice,
    category: string('extension_attributes.gtm_data.category_en'),
    brand: string('extension_attributes.gtm_data.brand_en'),
    discount_price: discountPrice,
    original_price: originalPrice,
  };
};
export const ProductAddAttribute = (data, section) => {
  const { string } = setModel(data);
  const dataSpecialPrice = parseFloat(string('special_price'));
  let dataPrice = string('price');
  if (dataSpecialPrice > 0) {
    dataPrice = string('special_price');
  }
  const dataAttr = {
    'data-productid': string('sku'),
    'data-productname': string('extension_attributes.gtm_data.product_name_en'),
    'data-productprice': dataPrice,
    'data-productcategory': string('extension_attributes.gtm_data.category_en'),
    'data-productbrand': string('extension_attributes.gtm_data.brand_en'),
    'data-qty': 1,
  };
  if (section) {
    dataAttr['data-productsection'] = section;
  }
  return dataAttr;
};
export const ProductAddAttributeNoQty = data => {
  const { string } = setModel(data);
  const dataSpecialPrice = parseFloat(string('special_price'));
  let dataPrice = string('price');
  if (dataSpecialPrice > 0) {
    dataPrice = string('special_price');
  }
  return {
    'data-productid': string('sku'),
    'data-productname': string('extension_attributes.gtm_data.product_name_en'),
    'data-productprice': dataPrice,
    'data-productcategory': string('extension_attributes.gtm_data.category_en'),
    'data-productbrand': string('extension_attributes.gtm_data.brand_en'),
  };
};
