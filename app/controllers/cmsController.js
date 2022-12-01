import MAQB from '../../client/utils/maqb';
import { get as prop } from 'lodash';
import { addFieldToQueryBuilder } from '../utils';
import CMSService from '../services/cmsService';

const search = async (req, res) => {
  const store = req.headers['x-store-code'] || '';
  const queryBuilder = new MAQB();
  const filter = req.query;

  try {
    queryBuilder.size(filter.page_size || 8).page(filter.page_number || 1);

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

    const query = queryBuilder.build();

    const pages = await CMSService.search(store, query);
    return res.json({ pages });
  } catch (e) {
    console.error(prop(e, 'message', ''));
    return res.json({ pages: [] });
  }
};

export default {
  search,
};
