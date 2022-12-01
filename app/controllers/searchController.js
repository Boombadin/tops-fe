import SearchService from '@app/services/searchService';

const fetchProducts = async (req, res) => {
  try {
    const store = req.headers['x-store-code'];
    const {
      query,
      sort,
      categoryId,
      page,
      filters,
      userId,
      abtest,
    } = req.query;

    let intentAlias = 'prime';
    if (abtest === 'true') {
      intentAlias = 'alternate';
    }

    const response = await SearchService.fetchProducts({
      query,
      store,
      sort,
      categoryId,
      page,
      filters,
      userId,
      intentAlias,
    });

    if (typeof req.redis !== 'undefined') {
      req.redis.set(req.redisKey, JSON.stringify(response), 'EX', 300);
    }

    return res.json(response);
  } catch (error) {
    return res.json({ error: error.message });
  }
};

const fetchSuggestions = async (req, res) => {
  try {
    const store = req.headers['x-store-code'];
    const { query } = req.query;

    const response = await SearchService.fetchSuggestions({ query, store });

    if (typeof req.redis !== 'undefined') {
      req.redis.set(req.redisKey, JSON.stringify(response), 'EX', 300);
    }

    return res.json(response);
  } catch (error) {
    return res.json({ error: error.message });
  }
};

export default {
  fetchProducts,
  fetchSuggestions,
};
