import CMSBlockService from '../services/cmsBlockService';
// import { getCache, setCache } from '../utils/cache'

const getAll = async (req, res) => {
  const store = req.headers['x-store-code'];
  const filters = req.params.slug;
  // const CMS_BLOCK = `cms_${store}`

  try {
    // const cms = getCache(CMS_BLOCK)

    // if (cms) {
    //   return res.json({ cmsBlock: cms })
    // }

    const cmsBlock = await CMSBlockService.get(store, filters);

    if (typeof req.redis !== 'undefined') {
      req.redis.set(req.redisKey, JSON.stringify({ cmsBlock: cmsBlock }), 'EX', 3600);
    }

    // setCache(CMS_BLOCK, cmsBlock)

    return res.json({ cmsBlock });
  } catch (e) {
    return res.json({ cmsBlock: [] });
  }
};

export default {
  getAll,
};
