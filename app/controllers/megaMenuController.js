import { get as prop } from 'lodash';
import megaMenuService from '../services/megaMenuService';

const fetch = async (req, res) => {
  try {
    const filter = req.query;
    const megaMenuConfig = await megaMenuService.get(
      prop(filter, 'store_id', ''),
    );

    let status = 'error';
    if (megaMenuConfig) {
      status = 'success';
    }

    if (typeof req.redis !== 'undefined') {
      req.redis.set(
        req.redisKey,
        JSON.stringify({
          status: status,
          megaMenuConfig: megaMenuConfig,
        }),
        'EX',
        86400,
      );
    }

    return res.json({
      status: status,
      megaMenuConfig: megaMenuConfig,
    });
  } catch (e) {
    return res.json({ status: 'error', message: `can't get store configs.` });
  }
};

export default {
  fetch,
};
