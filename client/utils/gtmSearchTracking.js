import { get } from 'lodash';

export function gtmSearchSuggestionLabel(inputValue, suggestion) {
  const label = {}
  if ( suggestion.type === 'category' ){
    label['suggestion-label'] = `categories_${inputValue}_${get(suggestion,'title')}`
  } else if ( suggestion.type !== 'product' ) {
    label['suggestion-label'] = `${get(suggestion,'type')}_${inputValue}_${get(suggestion,'title')}`
  }
  return label
}

export function gtmSearchSuggestionAttr(inputValue, suggestion) {
  if ( suggestion.type === 'product' ){
    const dataProduct = {
      'suggestion-productid': get(suggestion, 'sku', ''),
      'suggestion-name': get(suggestion, 'title', ''),
      'suggestion-price': get(suggestion, 'fianl_price') ? get(suggestion, 'fianl_price'): get(suggestion, 'price'),
      'suggestion-brand': get(suggestion, 'brand_name', ''),
      'suggestion-list': "Search suggestions",
      'suggestion-label': `products_${inputValue}_${get(suggestion,'sku')}`,
    }
    return dataProduct
  }
  return {}
}
