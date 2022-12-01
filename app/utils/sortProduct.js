import { map, find, isEmpty } from 'lodash';

export const sortProductByApi = (order, products) => {
  const newProducts = [];
  map(order, itemSku => {
    const filterItem = find(products, item => {
      return item.sku === itemSku;
    });

    if (!isEmpty(filterItem)) {
      newProducts.push(filterItem);
    }
  });

  return newProducts;
};
