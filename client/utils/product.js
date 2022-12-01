import remove from 'lodash/remove';

export function orderProductBySkus({ products = [], skus = [] }) {
  const availableProduct = products.filter(product => !!product.sku);

  const orderAvailableProducts = skus.reduce((accumulator, sku) => {
    const product = remove(availableProduct, ['sku', sku]);
    return [...accumulator, ...product];
  }, []);

  return [...orderAvailableProducts, ...availableProduct];
}
