import { map, find, get as prop } from 'lodash'

export function formatFilterPromotionIcon(filters, storeConfig) {
  const formatedFilters = map(filters, (filter) => {
    const thisAttrCode = prop(filter, 'attribute_code')
    
    if (thisAttrCode !== 'promotion_type') return filter
    
    const filterByPromotionTypeItems = prop(filter, 'items')
    const formatedFilterItem = map(filterByPromotionTypeItems, item => {
      const baseMediaUrl = storeConfig.base_media_url
      const storeImage = storeConfig.extension_attributes[`${item.value.toLowerCase()}_image`]
      const image = `${baseMediaUrl}${storeImage}`
      const data = {
        ...item,
        icon: image
      }
      
      return data
    })
    
    return {
      ...filter,
      items: formatedFilterItem
    }
  })
  
  return formatedFilters
}
