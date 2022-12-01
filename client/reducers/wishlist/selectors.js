import { keyBy, isEmpty, map, find, filter, } from 'lodash'

export const getWishlist = state => state.wishlist.wishlist

export const getIsWishlistLoading = state => state.wishlist.loading

export const getIsWishlistProductsLoading = state =>
  state.wishlist.productsLoading

export const getWishlistItmesByProductId = state => {
  const wishlist = getWishlist(state)

  if (isEmpty(wishlist)) {
    return {}
  }

  return keyBy(state.wishlist.wishlist.items, 'product_id')
}

export const getWishlistItemsWithProducts = state => {
  const wishlist = getWishlist(state)
  const products = state.product.items

  if (isEmpty(wishlist)) {
    return []
  }

  const wishlistItemsWithProducts = filter(
    products,
    product => !!find(wishlist.items, item => item.product_id === product.id)
  )

  return map(wishlistItemsWithProducts, product => ({
    product: { ...product, isAddedToWishlist: true },
    ...find(wishlist.items, item => item.product_id === product.id)
  }))
}
