import {
  get,
  find,
  filter,
  isEmpty,
  uniqBy,
  map,
  concat,
  orderBy,
  isUndefined,
} from 'lodash';
import { format } from '../../../utils/time';

export const getDeliveryLock = seasonalConfig => {
  return find(seasonalConfig, object => {
    return object.delivery_lock === true;
  });
};

export const deliveryLimitDate = (storeConfig, seasonalConfig) => {
  const startDateDelivery = get(
    getDeliveryLock(seasonalConfig),
    'delivery_start_date',
  );
  const endDateDelivery = get(
    getDeliveryLock(seasonalConfig),
    'delivery_end_date',
  );

  const endDeliveryDay = format(endDateDelivery, 'DD', storeConfig.locale);
  const endDeliveryMonth = format(endDateDelivery, 'MM', storeConfig.locale);
  const endDeliveryYear =
    parseInt(format(endDateDelivery, 'YYYY', storeConfig.locale), 0) +
    (storeConfig.locale === 'th_TH' ? 543 : 0);

  const checkOneDate =
    format(startDateDelivery, 'DD MMM YYYY', storeConfig.locale) ===
    format(endDateDelivery, 'DD MMM YYYY', storeConfig.locale);

  let dateLimit;
  if (checkOneDate) {
    dateLimit = format(startDateDelivery, 'DD MMM YYYY', storeConfig.locale);
  } else {
    dateLimit = `${format(
      startDateDelivery,
      'DD',
      storeConfig.locale,
    )} - ${format(
      `${endDeliveryYear}-${endDeliveryMonth}-${endDeliveryDay}`,
      'DD MMM YYYY',
      storeConfig.locale,
    )}`;
  }

  return dateLimit;
};

export const getCategoryInCart = (mainCategory, products) => {
  let listCategory = [];
  const newProduct = [];
  const listOtherCategory = {
    category_Id: '',
    name: 'other',
    items: [],
  };

  map(products, product => {
    const categories = get(product, 'category', []);
    const filterMainCate = find(mainCategory, mainCate => {
      return find(categories, cate => {
        return (
          get(cate, 'category_id', '') == get(mainCate, 'id') &&
          get(mainCate, 'level') === 2
        );
      });
    });

    if (!isEmpty(filterMainCate)) {
      product.category_id = get(filterMainCate, 'entity_id', '');
      newProduct.push(product);

      listCategory = concat(listCategory, filterMainCate);
    } else {
      listOtherCategory.items.push(product);
    }
  });

  let categoryInCart = uniqBy(listCategory, cate => cate.id);

  if (!isEmpty(categoryInCart)) {
    categoryInCart = orderBy(categoryInCart, 'position', 'asc');
  } else {
    listOtherCategory.items = products;
  }

  return getProductInCategory(newProduct, categoryInCart, listOtherCategory);
};

export const getProductInCategory = (
  products,
  categoryInCart,
  listOtherCategory,
) => {
  const itemToCategoryInCart = map(categoryInCart, category => {
    const filterProduct = filter(products, product => {
      return (
        get(product, 'category_id', []) === get(category, 'id', '').toString()
      );
    });
    category.items = filterProduct;

    return category;
  });

  if (get(listOtherCategory, 'items', []).length > 0) {
    itemToCategoryInCart.push(listOtherCategory);
  }

  return itemToCategoryInCart;
};

export const splitLimitDelivery = (items, storeConfig) => {
  const seasonalConfig = get(
    storeConfig,
    'extension_attributes.seasonal_badge',
  );
  const itemSeasonal = filter(items, object => {
    return !isEmpty(object.seasonal);
  });
  let dateLimit = deliveryLimitDate(storeConfig, seasonalConfig);
  const itemNormal = filter(items, object => {
    return !object.seasonal;
  });

  const seasonal = [];
  const normal = itemNormal;

  map(itemSeasonal, item => {
    const config = find(seasonalConfig, object => {
      return object.code === item.seasonal;
    });
    if (!isEmpty(config) && config.delivery_lock) {
      seasonal.push(item);
    } else {
      normal.push(item);
    }
  });

  if (seasonal.length <= 0) {
    dateLimit = '';
  }

  return { dateLimit, seasonal, normal };
};

export const splitBundleLimitDelivery = (bundles, storeConfig) => {
  const seasonalConfig = get(
    storeConfig,
    'extension_attributes.seasonal_badge',
    [],
  );
  const seasonalBundles = [];
  const normalBundles = [];

  map(bundles, object => {
    const filterSeasonalBundles = filter(get(object, 'items', []), item => {
      const seasonConfig = find(seasonalConfig, config => {
        return config.code === item.seasonal;
      });
      return (
        !isUndefined(item.seasonal) &&
        !isEmpty(seasonConfig) &&
        seasonConfig.delivery_lock
      );
    });

    if (filterSeasonalBundles.length > 0) {
      seasonalBundles.push({ ...object, items: filterSeasonalBundles });
    }
  });

  map(bundles, object => {
    const filterNormalBundles = filter(get(object, 'items', []), item => {
      const seasonConfig = find(seasonalConfig, config => {
        return config.code === item.seasonal;
      });
      return (
        isEmpty(seasonConfig) ||
        (!isUndefined(item.seasonal) &&
          !isEmpty(seasonConfig) &&
          !seasonConfig.delivery_lock)
      );
    });

    if (filterNormalBundles.length > 0) {
      normalBundles.push({ ...object, items: filterNormalBundles });
    }
  });

  return { seasonalBundles, normalBundles };
};
