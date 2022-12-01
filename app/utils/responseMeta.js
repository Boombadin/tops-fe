import { get } from 'lodash'

export const responseMeta = (data, locate) => {
  const formatData = {}
  const options = {}
  const arrMeta = get(data, 'custom_attributes', [])
  const arrOptions = get(data, 'custom_attributes_option', [])
  arrOptions.forEach((item) => {
    if (item.attribute_code) {
      options[item.attribute_code] = item.value
    }
  })
  arrMeta.forEach((item) => {
    if (item.attribute_code) {
      formatData[item.attribute_code] = item.value
    }
  })

  const name = get(data, 'name', '')
  const brand = get(options, 'brand_name', '')
  const url = get(formatData, 'url_key', '')

  if (!formatData.meta_title) {
    formatData.meta_title = name ? `${name} | Tops online` : ''
  }
  if (!formatData.meta_description) {
    switch (locate) {
      case 'en_US':
        formatData.meta_description = brand ? `Shop online ${name} from ${brand} Tops online` : ''
        break
      case 'th_TH':
      default:
        formatData.meta_description = brand ? `ช็อป ออนไลน์ ${name} จาก ${brand} Tops online` : ''
    }
  }
  if (!formatData.og_url) {
    switch (locate) {
      case 'en_US':
        formatData.og_url = `/en/${url}`
        break
      case 'th_TH':
      default:
        formatData.og_url = `/th/${url}`
    }
  }
  return formatData
}
