import { orderBy, get as prop, reduce, filter, map, unset, size } from 'lodash';
import Exploder from '../../client/utils/mcaex';
import MAQB from '../../client/utils/maqb';
import CategoryService from '../services/categoryService';
import ProductService from '../services/productService';
import { currentStoreViewCode } from '../store';
import { transform } from '../utils/transformCategory';

const getAll = async (req, res) => {
  const store = req.headers['x-store-code'];

  if (!store)
    return res.status(500).json({ message: 'store code is not valid.' });

  try {
    let categories = [];

    const queryBuilder = new MAQB();

    const query = queryBuilder
      .field('is_active', 1, 'eq')
      .sort('position', 'ASC')
      .build();

    const categoryResponse = await CategoryService.get(query, store);

    if (prop(categoryResponse, 'items', []).length > 0) {
      categories = categoryResponse.items;
      categories = categories.map(item => {
        return transform(item);
      });

      categories = orderBy(categories, 'position', 'asc');

      categories = reduce(
        categories,
        (result, value) => {
          result.push({
            ...value,
            children: filter(categories, cate => {
              return cate.parent_id === value.id;
            })
              .map(value => {
                return value.id;
              })
              .toString(),
          });

          return result;
        },
        [],
      );

      map(categories, cate => unset(cate, 'product_count'));

      if (typeof req.redis !== 'undefined') {
        req.redis.set(
          req.redisKey,
          JSON.stringify({ categories: categories }),
          'EX',
          3600,
        );
      }
    }

    return res.json({ categories });
  } catch (e) {
    console.error(prop(e, 'message', ''));
    return res
      .status(500)
      .json({ categories: {}, message: 'invalid request.' });
  }
};

const getOne = async (req, res) => {
  const store = req.headers['x-store-code'];
  const { slug } = req.params;
  const query = new MAQB().field('url_path', slug, 'eq').build();

  try {
    const category = await CategoryService.fetchOneByUrlkey(query, store);

    if (typeof req.redis !== 'undefined') {
      req.redis.set(
        req.redisKey,
        JSON.stringify({ category: category }),
        'EX',
        3600,
      );
    }

    return res.json({ category });
  } catch (e) {
    console.error(prop(e, 'message', ''));
    return res.json({ category: {} });
  }
};

const getProducts = async (req, res) => {
  const store = currentStoreViewCode(req.cookies);

  try {
    const products = await CategoryService.fetchProducts(store, req.params.id);

    if (typeof req.redis !== 'undefined') {
      req.redis.set(req.redisKey, JSON.stringify({ products }), 'EX', 3600);
    }

    return res.json({ products });
  } catch (e) {
    console.error(prop(e, 'message', ''));
    return {
      categories: [],
    };
  }
};

const getProductSets = async (req, res) => {
  const store = req.headers['x-store-code'];
  const { subcategoryId } = req.query;
  const setSubCate = subcategoryId.split(',');

  try {
    const productSets = [];

    await Promise.all(
      map(setSubCate, async subCateId => {
        if (subCateId) {
          const queryProductBuilder = new MAQB();
          queryProductBuilder
            .field('category_id', subCateId, 'eq')
            .size(20)
            .page(1)
            .field('$product.status', '1', 'eq')
            .field('stock.is_in_stock', '1', 'eq')
            .fieldGroup(['visibility,2,eq', 'visibility,4,eq'])
            .field('price', '0', 'gt');

          const queryProduct = queryProductBuilder.build();
          const products = await ProductService.get(store, queryProduct);

          if (products && size(products.items) > 0) {
            products.items = products.items.map(item => {
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

          productSets.push({
            categoryId: subCateId,
            products,
          });
        }
      }),
    );

    if (typeof req.redis !== 'undefined') {
      req.redis.set(req.redisKey, JSON.stringify({ productSets }), 'EX', 3600);
    }

    return res.json({ productSets });
  } catch (e) {
    console.error(prop(e, 'message', ''));
    return {
      productSets: [],
    };
  }
};

export default {
  getAll,
  getOne,
  getProducts,
  getProductSets,
};
