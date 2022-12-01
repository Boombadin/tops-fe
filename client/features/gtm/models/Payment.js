import { setModel } from '../../../utils/Model'

export const Payment = (data) => {
  const { string } = setModel(data)
  return {
    id: string('sku'),
    name: string('extension_attributes.gtm_data.product_name_en'),
    price: string('price_incl_tax'),
    category: string('extension_attributes.gtm_data.category_en'),
    brand: string('extension_attributes.gtm_data.brand_en'),
    quantity: string('qty'),
  }
}
