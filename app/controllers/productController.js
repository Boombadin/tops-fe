import {
  chunk,
  find,
  floor,
  get as prop,
  head,
  isEmpty,
  join,
  map,
  size,
  split,
  unionBy,
} from 'lodash';
import moment from 'moment';

import config from '@app/config';
import CustomerService from '@app/services/customerService';
import ProductService from '@app/services/productService';
import storeConfigService from '@app/services/storeConfigService';
import {
  addFieldSetToQueryBuilder,
  addFieldToQueryBuilder,
  addFiltersToQueryBuilder,
  addSortingToQueryBuilder,
} from '@app/utils';
import { sortProductByApi } from '@app/utils/sortProduct';
import MAQB from '@client/utils/maqb';
import Exploder from '@client/utils/mcaex';

const dataTeamApiUrlA = config.data_team_api_base_url;
const dataTeamApiUrlB = config.data_team_api_base_url_b;
const tokenDataTeamA = config.data_team_api_token;
const tokenDataTeamB = config.data_team_api_token_b;

const fetch = async (req, res) => {
  const store = req.headers['x-store-code'];
  const siteId = req.headers['x-website-id'];
  if (!store || !siteId)
    return res.json({ message: 'store code is not valid.', products: {} });

  try {
    const filter = req.query;
    const queryBuilder = new MAQB();

    queryBuilder
      .size(filter.page_size || 8)
      .page(filter.page_number || 1)
      .field('$product.status', '1', 'eq')
      .field('stock.is_in_stock', '1', 'eq')
      .field('price', '0', 'gt')
      .fieldGroup(['visibility,2,eq', 'visibility,4,eq']);

    let datalakeProduct = [];
    if (prop(filter, 'product_recommend', '')) {
      if (prop(JSON.parse(filter.product_recommend), 'product')) {
        datalakeProduct = prop(
          JSON.parse(filter.product_recommend),
          'product',
          '',
        );
      } else {
        datalakeProduct = JSON.parse(filter.product_recommend);
      }
    }

    if (
      datalakeProduct &&
      filter.field &&
      typeof filter.field === 'string' &&
      filter.field === 'recommended,1,eq' &&
      datalakeProduct.length > 0
    ) {
      const stringValue = join(datalakeProduct, ',');
      if (filter.page_number === '1') {
        addFieldSetToQueryBuilder(queryBuilder, 'sku', stringValue, 'in');
        filter.field = false;
        queryBuilder.size(30);
      } else {
        queryBuilder.page(filter.page_number - 1);
        addFieldSetToQueryBuilder(queryBuilder, 'sku', stringValue, 'nin');
      }
    }

    if (filter.field) {
      if (typeof filter.field === 'string') {
        addFieldToQueryBuilder(queryBuilder, filter.field);
      } else if (typeof filter.field === 'object') {
        for (let i = filter.field.length - 1; i >= 0; i--) {
          const field = filter.field[i];
          addFieldToQueryBuilder(queryBuilder, field);
        }
      }
    }

    addFiltersToQueryBuilder(queryBuilder, filter.filters);

    if (filter.sort) {
      addSortingToQueryBuilder(queryBuilder, filter.sort);
    }

    const query = queryBuilder.build();

    const products = await ProductService.get(store, query);

    if (products && size(products.items) > 0) {
      products.items = products.items.map(item => {
        const formatItem = Exploder.explode(item);
        formatItem.special_price = prop(item, 'special_price', 0);
        formatItem.special_from_date = prop(item, 'special_from_date', '');
        formatItem.special_to_date = prop(item, 'special_to_date', '');
        formatItem.url = `/${item.url_key}`;

        return formatItem;
      });
    }

    if (typeof req.redis !== 'undefined') {
      req.redis.set(
        req.redisKey,
        JSON.stringify({ products: products }),
        'EX',
        300,
      );
    }

    return res.json({ products: products });
  } catch (e) {
    console.error(prop(e, 'message', ''));
    const statusCode = e?.response?.status || 500;
    const errorMessage = JSON.stringify(e?.response?.data || '');
    return res
      .status(statusCode)
      .json({ products: {}, status: 'error', message: errorMessage });
  }
};

const fetchPromotion = async (req, res) => {
  const store = req.headers['x-store-code'];
  const siteId = req.headers['x-website-id'];

  if (!store || !siteId)
    return res.json({ message: 'store code is not valid.', products: {} });

  try {
    const filter = req.query;
    const queryBuilder = new MAQB();

    const promotionType = encodeURIComponent(
      'Red Hot,Sale,BOGO,B1GV,B2G1,B2GV,B3G1,B3GV',
    );

    queryBuilder
      .size(filter.page_size || 8)
      .page(filter.page_number || 1)
      .field('$product.status', '1', 'eq')
      .field('stock.is_in_stock', '1', 'eq')
      .field('price', '0', 'gt')
      .fieldGroup(['visibility,2,eq', 'visibility,4,eq']);

    if (!isEmpty(filter.field)) {
      const fields = filter.field;
      const key = split(fields, ',')[0];
      const value = split(fields, ',')[1];
      const condition = split(fields, ',')[2];
      addFieldSetToQueryBuilder(queryBuilder, key, value, condition);
    }

    if (!isEmpty(JSON.parse(prop(filter, 'filters', {})))) {
      addFiltersToQueryBuilder(queryBuilder, filter.filters);
    }

    if (filter.sort) {
      addSortingToQueryBuilder(queryBuilder, filter.sort);
    }

    if (isEmpty(JSON.parse(prop(filter, 'filters', {})))) {
      queryBuilder
        .fieldGroup([
          `the1card_startdate,${moment().format('YYYY-MM-DD HH:mm:ss')},lt`,
          `promotion_type,${promotionType},in`,
        ])
        .fieldGroup([
          `the1card_enddate,${moment().format('YYYY-MM-DD HH:mm:ss')},gt`,
          `promotion_type,${promotionType},in`,
        ]);
    }

    const query = queryBuilder.build();

    const products = await ProductService.get(store, query);

    if (products && size(products.items) > 0) {
      products.items = products.items.map(item => {
        const formatItem = Exploder.explode(item);
        formatItem.special_price = prop(item, 'special_price', 0);
        formatItem.special_from_date = prop(item, 'special_from_date', '');
        formatItem.special_to_date = prop(item, 'special_to_date', '');
        formatItem.url = `/${item.url_key}`;

        return formatItem;
      });
    }

    if (typeof req.redis !== 'undefined') {
      req.redis.set(
        req.redisKey,
        JSON.stringify({ products: products }),
        'EX',
        300,
      );
    }

    return res.json({ products: products });
  } catch (e) {
    console.error(prop(e, 'message', ''));
    return res.status(500).json({ products: {}, status: 'error' });
  }
};

const fetchSet = async (req, res) => {
  const store = req.headers['x-store-code'];
  const siteId = req.headers['x-website-id'];
  if (!store || !siteId)
    return res.json({ message: 'store code is not valid.', products: {} });

  const { categories } = req.query;
  const pageSize = 20;
  const pageNumber = req.query.page_number || 1;

  const catePromoise = [];
  let mergeResult = [];
  let mainObj = {};

  try {
    const cateArray = categories.split(',');
    cateArray.map(cateId => {
      const queryBuilder = new MAQB();
      const query = queryBuilder
        .size(pageSize)
        .page(pageNumber)
        .field('category.category_id', cateId, 'eq')
        .field('$product.status', '1', 'eq')
        .field('stock.is_in_stock', '1', 'eq')
        .field('price', '0', 'gt')
        .fieldGroup(['visibility,2,eq', 'visibility,4,eq'])
        .sort('name', 'ASC')
        .build();
      const products = ProductService.get(store, query);
      catePromoise.push(products);
    });

    const allProduct = await Promise.all(catePromoise);
    mainObj = allProduct[0];

    allProduct.map(productObj => {
      mergeResult = unionBy(mergeResult, productObj.items, 'id');
    });

    if (mergeResult && mergeResult.length > 0) {
      mergeResult = mergeResult.map(item => {
        const formatItem = Exploder.explode(item);
        formatItem.special_price = prop(item, 'special_price', 0);
        formatItem.special_from_date = prop(item, 'special_from_date', '');
        formatItem.special_to_date = prop(item, 'special_to_date', '');
        formatItem.url = `/${item.url_key}`;

        return formatItem;
      });
    }
    mainObj.items = mergeResult;
  } catch (e) {
    mergeResult = [];
  }

  if (typeof req.redis !== 'undefined') {
    req.redis.set(
      req.redisKey,
      JSON.stringify({ products: mainObj }),
      'EX',
      300,
    );
  }

  return res.json({
    products: mainObj,
  });
};

const fetchCampaignCatalog = async (req, res) => {
  const store = req.headers['x-store-code'];
  const queryBuilder = new MAQB();
  const { productSku } = req.query;

  try {
    queryBuilder
      .field('sku', productSku.toString(), 'in')
      .field('$product.status', '1', 'eq')
      .field('stock.is_in_stock', '1', 'eq')
      .field('price', '0', 'gt')
      .fieldGroup(['visibility,2,eq', 'visibility,4,eq'])
      .size(25)
      .page(1);

    const queryFiller = queryBuilder.build();
    let data = await ProductService.get(store, queryFiller);
    let products = prop(data, 'items', []);

    if (products && products.length > 0) {
      products = products.map(item => {
        const formatItem = Exploder.explode(item);
        formatItem.special_price = prop(item, 'special_price', 0);
        formatItem.special_from_date = prop(item, 'special_from_date', '');
        formatItem.special_to_date = prop(item, 'special_to_date', '');
        formatItem.url = `/${item.url_key}`;

        return formatItem;
      });
    }

    let newProducts = [];
    const campaignSku = productSku.split(',');

    if (campaignSku.length > 0) {
      newProducts = sortProductByApi(campaignSku, products);
    }

    if (newProducts.length > 0) {
      data = {
        ...data,
        items: newProducts,
      };
    }

    if (typeof req.redis !== 'undefined') {
      req.redis.set(
        req.redisKey,
        JSON.stringify({ product_campaign: data }),
        'EX',
        300,
      );
    }

    return res.json({ product_campaign: data });
  } catch (e) {
    return res.json({ product_campaign: [] });
  }
};

const fetchOne = async (req, res) => {
  const store = req.headers['x-store-code'];
  const { slug } = req.params;

  try {
    let product = await ProductService.getOne(store, slug);

    if (prop(product, 'type_id') === 'bundle') {
      const childrenProduct = prop(
        product,
        'extension_attributes.bundle_product_options.0.product_links.0',
      );

      const { products } = await ProductService.getCatalogServiceBySku(
        prop(childrenProduct, 'sku', ''),
        store,
        1,
      );

      const foundProduct = find(products, product => {
        return prop(product, 'sku', '') === prop(childrenProduct, 'sku', '');
      });

      const childStockItem = prop(
        foundProduct,
        'extension_attributes.stock_item.qty',
        prop(product, 'extension_attributes.stock_item.qty'),
      );
      const pack = prop(childrenProduct, 'qty', 1);
      const stockQty = floor(parseFloat(childStockItem) / parseFloat(pack));

      product = {
        ...product,
        extension_attributes: {
          ...product.extension_attributes,
          stock_item: {
            ...product.extension_attributes.stock_item,
            qty: stockQty,
            is_in_stock:
              prop(product, 'extension_attributes.stock_item.is_in_stock') &&
              prop(foundProduct, 'status') === 1 &&
              stockQty > 0,
          },
        },
      };
    }

    if (typeof req.redis !== 'undefined') {
      req.redis.set(req.redisKey, JSON.stringify({ product }), 'EX', 300);
    }

    return res.json({ product });
  } catch (e) {
    return res.json({ product: {} });
  }
};

const fetchProductRecommendPersonal = async (req, res) => {
  const productRecommend = req.query.product_recommend;

  try {
    const product = await ProductService.getProductRecommendPersonal(
      productRecommend,
    );
    if (typeof req.redis !== 'undefined') {
      req.redis.set(req.redisKey, JSON.stringify({ product }), 'EX', 300);
    }
    return res.json({ product: product });
  } catch (e) {
    return res.json({ product: [] });
  }
};

const fetchSetBySku = async (req, res) => {
  const store = req.headers['x-store-code'];
  const siteId = req.headers['x-website-id'];
  if (!store || !siteId)
    return res.json({ message: 'store code is not valid.', products: {} });

  const { categories } = req.query;
  const pageSize = 20;
  const pageNumber = req.query.page_number || 1;

  const catePromoise = [];
  let mergeResult = [];
  let mainObj = {};

  try {
    const cateArray = categories.split(',');
    cateArray.map(cateId => {
      const queryBuilder = new MAQB();
      const query = queryBuilder
        .size(pageSize)
        .page(pageNumber)
        .field('category.category_id', cateId, 'eq')
        .field('$product.status', '1', 'eq')
        .sort('name', 'ASC')
        .field('stock.is_in_stock', '1', 'eq')
        .field('price', '0', 'gt')
        .build();
      const products = ProductService.get(store, query);
      catePromoise.push(products);
    });

    const allProduct = await Promise.all(catePromoise);
    mainObj = allProduct[0];

    allProduct.map(productObj => {
      mergeResult = unionBy(mergeResult, productObj.items, 'id');
    });

    if (mergeResult && mergeResult.length > 0) {
      mergeResult = mergeResult.map(item => {
        const formatItem = Exploder.explode(item);
        formatItem.special_price = prop(item, 'special_price', 0);
        formatItem.special_from_date = prop(item, 'special_from_date', '');
        formatItem.special_to_date = prop(item, 'special_to_date', '');
        formatItem.url = `/${item.url_key}`;

        return formatItem;
      });
    }
    mainObj.items = mergeResult;
  } catch (e) {
    mergeResult = [];
  }

  if (typeof req.redis !== 'undefined') {
    req.redis.set(
      req.redisKey,
      JSON.stringify({ products: mainObj }),
      'EX',
      300,
    );
  }

  return res.json({
    products: mainObj,
  });
};

const fetchByFilter = async (req, res) => {
  const store = req.headers['x-store-code'];
  const siteId = req.headers['x-website-id'];

  if (!store || !siteId)
    return res.json({ message: 'store code is not valid.', products: {} });

  const queryBuilder = new MAQB();
  const { key, slug, condition } = req.params;
  const { sort } = req.query;

  try {
    queryBuilder
      .field(key, slug, condition)
      .field('status', '1', 'eq')
      .field('stock.is_in_stock', '1', 'eq')
      .field('price', '0', 'gt')
      .fieldGroup(['visibility,2,eq', 'visibility,4,eq'])
      .size(30);

    if (sort) {
      addSortingToQueryBuilder(queryBuilder, sort);
    }

    const query = queryBuilder.build();
    const products = await ProductService.get(store, query);

    if (products.items.length > 0) {
      products.items = products.items.map(Exploder.explode);
      products.items = products.items.map(item => {
        item.url = `/${item.url_key}`;
        return item;
      });
    }

    if (typeof req.redis !== 'undefined') {
      req.redis.set(req.redisKey, JSON.stringify({ products }), 'EX', 300);
    }

    return res.json({ products });
  } catch (e) {
    console.error(prop(e, 'message', ''));
    return res.json({ products: {} });
  }
};

const fetchRelative = async (req, res) => {
  const { sku } = req.params;
  const store = req.headers['x-store-code'] || '';

  try {
    const responce = await ProductService.getRelatedForProduct(store, sku);
    let products = [];

    if (responce.items.length > 0) {
      products = responce.items;
      products = products.map(x => Exploder.explode(x));
      products = products.map(x => {
        x.url = `/${x.url_key}`;
        return x;
      });
    }

    if (typeof req.redis !== 'undefined') {
      req.redis.set(req.redisKey, JSON.stringify({ products }), 'EX', 300);
    }

    return res.json({ products });
  } catch (e) {
    return res.json({ products: [] });
  }
};

const fetchBySkus = async (req, res) => {
  const storeCode = req.headers['x-store-code'];
  const {
    query: { skus },
  } = req;
  const skuArray = Array.isArray(skus) ? skus : [skus];

  try {
    const products = await Promise.all(
      map(skuArray, sku => {
        return ProductService.getOneBySku(sku, storeCode);
      }),
    );

    if (!products) {
      return res.json(false);
    }

    return res.json({ items: products.map(Exploder.explode) });
  } catch (e) {
    return res.json(false);
  }
};

const fetchCatalogServiceBySku = async (req, res) => {
  const storeCode = req.headers['x-store-code'];
  const {
    query: { skus, plpFilter = false },
  } = req;
  const skuArray = Array.isArray(skus) ? skus.toString() : skus;

  if (isEmpty(skuArray)) {
    return res.json(false);
  }
  const pageSize = size(skuArray.split(','));

  try {
    const { products } = await ProductService.getCatalogServiceBySku(
      skuArray,
      storeCode,
      pageSize,
      plpFilter,
    );

    if (size(products) <= 0) {
      return res.json(false);
    }

    return res.json({
      items: products.map(product => {
        const formatItem = Exploder.explode(product);
        formatItem.special_price = prop(product, 'special_price', 0);
        formatItem.special_from_date = prop(product, 'special_from_date', '');

        return formatItem;
      }),
    });
  } catch (e) {
    return res.json(false);
  }
};

const getProductInfo = async (
  product,
  store,
  userGroup,
  productSimSlot,
  type,
) => {
  const queryBuilder = new MAQB();
  let dataFiller = [];

  if (!isEmpty(product?.filler)) {
    queryBuilder
      .field('sku', product?.filler.toString(), 'in')
      .field('stock.is_in_stock', '1', 'eq')
      .field('price', '0', 'gt')
      .fieldGroup(['visibility,2,eq', 'visibility,4,eq'])
      .size(20)
      .page(1);

    const queryFiller = queryBuilder.build();
    dataFiller = await ProductService.get(store, queryFiller);

    if (dataFiller && dataFiller?.items?.length > 0) {
      dataFiller.items = dataFiller?.items.map(item => {
        const formatItem = Exploder.explode(item);
        formatItem.special_price = prop(item, 'special_price', 0);
        formatItem.special_from_date = prop(item, 'special_from_date', '');
        formatItem.special_to_date = prop(item, 'special_to_date', '');
        formatItem.url = `/${item.url_key}`;

        return formatItem;
      });
    }
  }

  const newDataFiller = [];
  map(product?.filler, itemSku => {
    const filterItem = find(dataFiller?.items, item => {
      return item?.sku === itemSku;
    });

    if (!isEmpty(filterItem)) {
      newDataFiller.push(filterItem);
    }
  });

  const productInfo = {
    ...product,
    data: await Promise.all(
      map(product?.data, async val => {
        const queryBuilder = new MAQB();
        let data = [];
        if (!isEmpty(val?.item)) {
          queryBuilder
            .field('sku', val?.item.toString(), 'in')
            .field('stock.is_in_stock', '1', 'eq')
            .field('price', '0', 'gt')
            .fieldGroup(['visibility,2,eq', 'visibility,4,eq'])
            .size(20)
            .page(1);

          const query = queryBuilder.build();
          data = await ProductService.get(store, query);

          if (data && data?.items?.length > 0) {
            data.items = data?.items.map(item => {
              const formatItem = Exploder.explode(item);
              formatItem.special_price = prop(item, 'special_price', 0);
              formatItem.special_from_date = prop(
                item,
                'special_from_date',
                '',
              );
              formatItem.special_to_date = prop(item, 'special_to_date', '');
              formatItem.url = `/${item.url_key}`;

              return formatItem;
            });
          }
        }

        const newData = [];
        map(val?.item, itemSku => {
          const filterItem = find(data?.items, item => {
            return item?.sku === itemSku;
          });

          if (!isEmpty(filterItem)) {
            newData.push(filterItem);
          }
        });

        return {
          ...val,
          item: newData,
        };
      }),
    ),
    filler: newDataFiller,
  };

  let objProduct = {};
  const items = [];
  let slot = 0;

  map(productInfo?.data, data => {
    const checkSlot = prop(
      find(productSimSlot, { code: data?.code }),
      'slot',
      5,
    );

    slot += checkSlot;
    const showItem = chunk(data?.item, checkSlot);

    map(head(showItem), item => {
      items.push(item);
    });
  });

  if (items?.length < slot) {
    const showItem = chunk(productInfo?.filler, slot - items?.length);
    map(head(showItem), item => {
      items.push(item);
    });
  }

  objProduct = {
    type: type,
    userGroup: userGroup || null,
    name: product?.name,
    items: items,
  };

  return objProduct;
};

const fetchProductSimilarity = async (req, res) => {
  const { sku, store, userId, isGoogleOptimizeSimilarity } = req.query;

  try {
    const [userGroup, productsSim, storeConfig] = await Promise.all([
      CustomerService.getUserGroupConfig(!isEmpty(userId) ? userId : 0),
      ProductService.getProductSimilarity(
        sku,
        store,
        userId,
        isGoogleOptimizeSimilarity,
      ),
      storeConfigService.getDefaultConfig(),
    ]);

    const config = find(storeConfig, { code: store });
    const productSimSlot = prop(
      config,
      'extension_attributes.product_list_slot',
    );

    const products = await getProductInfo(
      productsSim,
      store,
      userGroup,
      productSimSlot,
      'similarity',
    );

    if (typeof req.redis !== 'undefined') {
      req.redis.set(req.redisKey, JSON.stringify({ products }), 'EX', 300);
    }

    return res.json({ products });
  } catch (e) {
    return res.json({ products: [] });
  }
};

const fetchProductAssociation = async (req, res) => {
  const { sku, store, userId, isGoogleOptimizeAssociation } = req.query;

  try {
    const [userGroup, productsAsso, storeConfig] = await Promise.all([
      CustomerService.getUserGroupConfig(!isEmpty(userId) ? userId : 0),
      ProductService.getProductAssociation(
        sku,
        store,
        userId,
        isGoogleOptimizeAssociation,
      ),
      storeConfigService.getDefaultConfig(),
    ]);

    const config = find(storeConfig, { code: store });
    const productSimSlot = prop(
      config,
      'extension_attributes.product_list_slot',
    );

    const products = await getProductInfo(
      productsAsso,
      store,
      userGroup,
      productSimSlot,
      'association',
    );

    if (typeof req.redis !== 'undefined') {
      req.redis.set(req.redisKey, JSON.stringify({ products }), 'EX', 300);
    }

    return res.json({ products });
  } catch (e) {
    return res.json({ products: [] });
  }
};

const fetchProductRecommendPersonalWithItem = async (req, res) => {
  try {
    const { productRecommend, isGoogleOptimize } = req.query;
    const store = req.headers['x-store-code'];

    let apiUrl = dataTeamApiUrlA;
    let apiKey = tokenDataTeamA;
    if (isGoogleOptimize === 'true') {
      apiUrl = dataTeamApiUrlB;
      apiKey = tokenDataTeamB;
    }

    const datalakeSkus = await ProductService.getProductRecommendPersonal(
      productRecommend,
      apiUrl,
      apiKey,
    );
    const dataLakeSkus = prop(datalakeSkus, '0.data.0.item', []);
    const dataLakeSkusString = dataLakeSkus ? dataLakeSkus.toString() : '';
    const queryDataLakeProduct = new MAQB()
      .field('$product.status', '1', 'eq')
      .field('stock.is_in_stock', '1', 'eq')
      .field('price', '0', 'gt')
      .field('sku', dataLakeSkusString, 'in')
      .fieldGroup(['visibility,2,eq', 'visibility,4,eq'])
      .size(30)
      .page(1)
      .sort('ranking', 'DESC')
      .build();

    const queryFilteredProduct = new MAQB()
      .field('$product.status', '1', 'eq')
      .field('stock.is_in_stock', '1', 'eq')
      .field('price', '0', 'gt')
      .field('recommended', '1', 'eq')
      .field('sku', dataLakeSkusString, 'nin')
      .fieldGroup(['visibility,2,eq', 'visibility,4,eq'])
      .size(30)
      .page(1)
      .sort('ranking', 'DESC')
      .build();

    const [productInDataLakeRes, productFilteredRes] = await Promise.all([
      ProductService.get(store, queryDataLakeProduct),
      ProductService.get(store, queryFilteredProduct),
    ]);
    const productInDataLake = sortProductBySkus(
      dataLakeSkus,
      prop(productInDataLakeRes, 'items', []),
    );
    const productFiltered = prop(productFilteredRes, 'items', []);
    const recommendProduct = productInDataLake
      .concat(productFiltered)
      .slice(0, 30);

    if (typeof req.redis !== 'undefined' && recommendProduct) {
      req.redis.set(
        req.redisKey,
        JSON.stringify({ products: recommendProduct }),
        'EX',
        300,
      );
    }

    return res.json({ products: recommendProduct });
  } catch (e) {
    return res.json({ products: [], message: e.message });
  }
};

function sortProductBySkus(skus = [], products = []) {
  const skusEmpty = !skus || skus.length === 0;
  const productsEmpty = !products || products.length === 0;

  if (skusEmpty || productsEmpty) return [];

  const sortedItem = [];

  skus.map(sku => {
    const item = products.find(item => item.sku === sku);

    if (item) {
      sortedItem.push(item);
    }
  });

  return sortedItem;
}

export default {
  fetch,
  fetchSet,
  fetchCampaignCatalog,
  fetchOne,
  fetchByFilter,
  fetchRelative,
  fetchBySkus,
  fetchProductSimilarity,
  fetchProductAssociation,
  fetchProductRecommendPersonal,
  fetchPromotion,
  fetchCatalogServiceBySku,
  fetchProductRecommendPersonalWithItem,
};
