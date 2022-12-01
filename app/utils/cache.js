const cache = require('lru-cache')({
  max: 5000,
  maxAge: 1000 * 60 * 2 // 2min
})

export const setCache = (key, value) => {
  return cache.set(key, value)
}

export const getCache = (key) => {
  return cache.get(key)
}
