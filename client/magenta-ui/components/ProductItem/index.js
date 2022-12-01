import React from 'react';

import ProductItem from '@client/magenta-ui/components/ProductItem/ProductItem';
import RowsProductItem from '@client/magenta-ui/components/ProductItem/RowsProductItem';

export default props =>
  props.isRowMode ? <RowsProductItem {...props} /> : <ProductItem {...props} />;
