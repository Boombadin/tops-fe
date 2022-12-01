import MAQB from '../../client/utils/maqb';
import { reduce, map, get as prop, orderBy } from 'lodash';
import bannerService from '../services/bannerService';

const get = async (req, res) => {
  const store = req.headers['x-store-code'];
  const bannerName = req.query.name;
  const categoryString = req.query.category;

  if (!store) return res.json({ error: 'store code missing' });
  if (!bannerName && !categoryString)
    return res.json({ error: 'params missing' });

  const queryBuilder = new MAQB();

  if (bannerName) {
    queryBuilder.field('name', bannerName, 'eq');
  }

  if (categoryString) {
    queryBuilder
      .field('page_type', '3', 'eq')
      .field('category_ids', categoryString, 'in');
  }

  const query = queryBuilder.build();

  try {
    let banners = await bannerService.fetch(store, query);
    let bannerItems = prop(banners, 'items', []);

    bannerItems = map(bannerItems, item => {
      const bannerPosition = prop(item, 'slide_position');
      let bannerList = prop(item, 'extension_attributes.slides', []);

      if (bannerPosition && bannerList) {
        bannerList = map(bannerList, banner => ({
          ...banner,
          position: JSON.parse(bannerPosition)[banner.id],
        }));

        bannerList = orderBy(bannerList, 'position', 'asc');
      }

      return {
        ...item,
        extension_attributes: {
          ...item.extension_attributes,
          slides: bannerList,
        },
      };
    });

    if (bannerItems && categoryString) {
      const filterBannerByCate = reduce(
        bannerItems,
        (result, item) => {
          const listOfCategory = item.category_ids.split(', ');
          const isContain = listOfCategory.includes(categoryString);

          if (isContain) {
            result.push(item);
          }

          return result;
        },
        [],
      );

      banners = {
        items: filterBannerByCate,
      };
    }

    if (typeof req.redis !== 'undefined') {
      req.redis.set(
        req.redisKey,
        JSON.stringify({
          banners: {
            items: bannerItems,
          },
        }),
        'EX',
        300,
      );
    }

    return res.json({
      banners: {
        items: bannerItems,
      },
    });
  } catch (e) {
    return res.json({ banners: null });
  }
};

export default {
  get,
};
