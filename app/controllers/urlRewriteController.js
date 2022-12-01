import urlRewrite from '../services/urlRewrite'

const get = async (req, res) => {
  const store = req.headers['x-store-code']
  const { path } = req.params;

  try {
    const response = await urlRewrite.get(store, path)

    if (typeof req.redis !== 'undefined') {
      req.redis.set(req.redisKey, JSON.stringify({ pathObj: response.data }), 'EX', 3600)
    }

    res.json({ pathObj: response.data })
  } catch (e) {
    res.json({ pathObj: { entity_type: 'product' } })
  }
}

export default {
  get
}
