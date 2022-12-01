import { get, last, noop } from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import LazyLoad from 'react-lazyload';
import { NavLink } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';

import {
  ProductAddAttribute,
  ProductAddAttributeNoQty,
  ProductImpressionAttr,
} from '@client/features/gtm/models/Product';
import CartActionButton from '@client/features/product/components/CartActionButton';
import Image from '@client/magenta-ui/components/Image';
import { GTM_CLASSES } from '@client/magenta-ui/constants/googleTagManager';
import { formatPrice } from '@client/magenta-ui/utils/price';

import './RowsProductItem.scss';
import './ProductItem.scss';

export const ProductItem = React.memo(
  ({
    product,
    className,
    id,
    sku,
    img,
    title,
    priceLabel,
    price,
    specialPrice,
    url,
    onAddToWishlist,
    onRemoveFromWishlist,
    isAddedToWishlist,
    disableAddToCart,
    addToCartLabel,
    outOfStockLabel,
    promoIconsNode,
    promoNamesNode,
    promoLinkNode,
    greyOutNotAvailable,
    orderItem,
    section,
    beforeAddProductCallback,
  }) => {
    const addToWishlist = e => {
      e.preventDefault();
      e.stopPropagation();
      isAddedToWishlist ? onRemoveFromWishlist(id) : onAddToWishlist(id);
    };
    const gtmAddtoCart = ProductAddAttribute(product, section);
    const gtmProductClick = ProductAddAttributeNoQty(product);

    let showPrice = null;
    let isInRange = false;
    if (get(product, 'extension_attributes.promotion.end_date')) {
      const currentTime = moment().format('YYYY-MM-DD HH:mm');
      isInRange = get(product, 'extension_attributes.promotion.end_date', '')
        ? currentTime <=
          moment(
            get(product, 'extension_attributes.promotion.end_date', ''),
            '',
          )
            .add(25200000 - 36000, 'ms')
            .format('YYYY-MM-DD HH:mm')
        : true;
    }

    if (isInRange && specialPrice && specialPrice != price) {
      showPrice = (
        <div className="price-elem">
          <p className="mt-price-line">{price}</p>
          <p>
            <span className="mt-price-number">
              {formatPrice(Number(specialPrice))}{' '}
            </span>
            <span className="mt-price-label">
              {' '}
              /{last(priceLabel.split(' '))}
            </span>
          </p>
        </div>
      );
    } else {
      showPrice = (
        <div className="price-elem">
          <p>
            <span className="mt-price-number">{formatPrice(price)} </span>
            <span className="mt-price-label">
              {' '}
              /{last(priceLabel.split(' '))}
            </span>
          </p>
        </div>
      );
    }
    const productImpressionsAttr = ProductImpressionAttr(
      product,
      section,
      orderItem,
    );
    return (
      <NavLink
        {...gtmProductClick}
        to={url}
        className={`mt-mt-pi-rows ${className} ${GTM_CLASSES.TRACK_PRODUCT_CLICK}`}
      >
        <div className="mt-pi-rows">
          {greyOutNotAvailable && disableAddToCart && (
            <div className="mt-mt-pi-rows__grey-out" />
          )}
          <div className="mt-pi-rows--image-column">
            <div className="mt-pi-rows--image">
              <LazyLoad height={100}>
                <Image
                  src={img}
                  sku={sku}
                  orderItem={orderItem}
                  product={product}
                  section={section}
                />
              </LazyLoad>
            </div>
          </div>
          <div className="mt-pi-rows--content-column">
            <div className="mt-pi-rows--title" {...productImpressionsAttr}>
              {title}
            </div>
            <div className="mt-pi-rows--promo-name mt-promo-names rows-layout">
              {promoNamesNode}
            </div>
            <div className="mt-pi-rows--promo-link">{promoLinkNode}</div>
            <div className="mt-pi-rows--promo-icon mt-promo-icons rows-layout">
              {promoIconsNode}
            </div>
            <div className="mt-pi-rows--price">{showPrice}</div>
          </div>
          <div className="mt-pi-rows--controls-column">
            <div className="mt-pi-rows--button">
              <CartActionButton
                addToCartLabel={addToCartLabel}
                product={product}
                gtm={gtmAddtoCart}
                outOfStockLabel={outOfStockLabel}
                beforeAddProductCallback={beforeAddProductCallback}
              />
            </div>
            <Icon
              className={`mt-add-to-wishlist--rows${
                isAddedToWishlist ? ' active' : ''
              }`}
              name="like"
              size="large"
              onClick={addToWishlist}
            />
          </div>
        </div>
      </NavLink>
    );
  },
);

ProductItem.propTypes = {
  isRowMode: PropTypes.bool,
  className: PropTypes.string,
  img: PropTypes.string,
  price: PropTypes.node,
  spacialPrice: PropTypes.node,
  priceLabel: PropTypes.string,
  addToCartLabel: PropTypes.string,
  outOfStockLabel: PropTypes.string,
  qty: PropTypes.number,
  promoNamesNode: PropTypes.node,
  promoIconsNode: PropTypes.node,
  badge: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      imgPromo: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ),
  url: PropTypes.string,
  discount: PropTypes.string,
  beforeAddProductCallback: PropTypes.func,
};

ProductItem.defaultProps = {
  isRowMode: false,
  className: '',
  img: 'http://via.placeholder.com/350x250',
  price: '',
  spacialPrice: '',
  url: '#',
  promoNamesNode: null,
  promoIconsNode: null,
  badge: [],
  discount: '',
  priceLabel: 'ชิ้น',
  addToCartLabel: 'Add to Cart',
  outOfStockLabel: 'Out of Stock',
  beforeAddProductCallback: noop,
};

export default ProductItem;
