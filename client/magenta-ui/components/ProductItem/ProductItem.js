import { ceil, get, isEmpty, last, noop } from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';

import {
  ProductAddAttribute,
  ProductAddAttributeNoQty,
  ProductImpressionAttr,
} from '@client/features/gtm/models/Product';
import CartActionButton from '@client/features/product/components/CartActionButton';
import Image from '@client/magenta-ui/components/Image';
import RibbonItem from '@client/magenta-ui/components/RibbonItem';
import { GTM_CLASSES } from '@client/magenta-ui/constants/googleTagManager';
import { formatPrice } from '@client/magenta-ui/utils/price';
import { eventTracking } from '@client/utils/datalakeTracking';

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
    isAddedToWishlist,
    onRemoveFromWishlist,
    disableAddToCart,
    addToCartLabel,
    outOfStockLabel,
    qty, // qty in cart,
    promoIconsNode,
    promoNamesNode,
    promoLinkNode,
    saveLabel,
    unitLabel,
    type,
    notifyTooltipNode,
    greyOutNotAvailable,
    productBadge,
    baseMediaUrl,
    orderItem,
    trackingSection,
    trackingUserId,
    section,
    history,
    beforeAddProductCallback,
  }) => {
    const addToWishlist = e => {
      e.preventDefault();
      e.stopPropagation();

      isAddedToWishlist ? onRemoveFromWishlist(id) : onAddToWishlist(id);
    };
    const gtmAddtoCart = ProductAddAttribute(product, section);
    const gtmProductClick = ProductAddAttributeNoQty(product);
    const productImpressionsAttr = ProductImpressionAttr(
      product,
      section,
      orderItem,
    );

    let discount = null;
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
    } else if (specialPrice && specialPrice > 0) {
      const currentTime = moment().format('YYYY-MM-DD HH:mm');
      isInRange = get(product, 'special_to_date', '')
        ? currentTime <=
          moment(get(product, 'special_to_date', ''), '')
            .add(25200000 - 36000, 'ms')
            .format('YYYY-MM-DD HH:mm')
        : true;
    }

    const promoType = get(product, 'extension_attributes.promotion.type', '')
      .toLowerCase()
      .replace(' ', '');

    if (
      specialPrice &&
      price &&
      price - specialPrice !== 0 &&
      isInRange &&
      promoType &&
      (promoType === 'redhot' || promoType === 'sale')
    ) {
      discount = (
        <div className="ribbon">
          <RibbonItem
            title={`${saveLabel} ${ceil(price - specialPrice, 2)} ${unitLabel}`}
          />
        </div>
      );
    }

    if (specialPrice && specialPrice != price && isInRange) {
      showPrice = (
        <div className="price-elem">
          <p className="mt-price-line">{price}</p>
          <p>
            <span className="mt-price-number">
              {formatPrice(Number(specialPrice))}{' '}
            </span>
            <span className="mt-price-label">
              {' '}
              /{!isEmpty(priceLabel) && last(priceLabel.split(' '))}
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
              /{!isEmpty(priceLabel) && last(priceLabel.split(' '))}
            </span>
          </p>
        </div>
      );
    }

    // GTM
    const addDataLayer = () => {
      if (trackingSection !== '') {
        eventTracking(
          'product_click',
          trackingUserId,
          sku,
          orderItem,
          url,
          price,
          trackingSection,
        );
      }
    };
    const handleClickProduct = () => {
      history.push(url);
    };
    switch (type) {
      case 'mini':
        return (
          <div className="mt-product-item mt-product-mini">
            <div className="product-item">
              <div className="product-item--image">
                <img src={img} alt={`Tops online ${title}`} width="200" />
              </div>
              <div className="product-detail-container">
                <div className="product-item--title">
                  <h3>{title}</h3>
                </div>
                <div className="product-item--price-wrapper">
                  <div className="product-item--price">{showPrice}</div>
                  <div className="product-item--seasonal-badge">
                    {get(productBadge, 'image_path') && (
                      <img
                        className="product-item-badge"
                        src={`${baseMediaUrl}${get(
                          productBadge,
                          'image_path',
                          '',
                        )}`}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="product-item--button">
                {notifyTooltipNode}
                <CartActionButton
                  addToCartLabel={addToCartLabel}
                  product={product}
                  gtm={gtmAddtoCart}
                  outOfStockLabel={outOfStockLabel}
                  beforeAddProductCallback={beforeAddProductCallback}
                  type={type}
                />
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div
            {...gtmProductClick}
            className={`mt-product-item ${className} ${GTM_CLASSES.TRACK_PRODUCT_CLICK}`}
            onClick={addDataLayer}
          >
            {greyOutNotAvailable && disableAddToCart && (
              <div className="mt-product-item__grey-out" />
            )}
            <div className={'product-item'}>
              <Icon
                className={`mt-add-to-wishlist${
                  isAddedToWishlist ? ' active' : ''
                }`}
                name="like"
                size="large"
                onClick={addToWishlist}
              />
              <div className="product-item--promo-icon mt-promo-icons">
                {promoIconsNode}
              </div>
              <div
                className="product-item-inner-wrap"
                onClick={handleClickProduct}
              >
                <div className="product-item--image">
                  <Image
                    src={img}
                    alt={`Tops online ${title}`}
                    width="200"
                    sku={sku}
                    orderItem={orderItem}
                    product={product}
                    section={section}
                  />
                </div>
                <div className="product-item--ribbon">{discount}</div>
                <div className="product-item--title">
                  <h3 {...productImpressionsAttr}>{title}</h3>
                </div>
                <div className="product-item--promo-name mt-promo-names">
                  {promoNamesNode}
                </div>
              </div>
              <div className="product-item--promo-link">{promoLinkNode}</div>
              <div className="product-item--price-wrapper">
                <div className="product-item--price">{showPrice}</div>
                <div className="product-item--seasonal-badge">
                  {get(productBadge, 'image_path') && (
                    <img
                      className="product-item-badge"
                      src={`${baseMediaUrl}${get(
                        productBadge,
                        'image_path',
                        '',
                      )}`}
                      title={get(productBadge, 'label', '')}
                    />
                  )}
                </div>
              </div>
              <div
                className="product-item--button"
                onClick={event => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
              >
                {notifyTooltipNode}
                <CartActionButton
                  addToCartLabel={addToCartLabel}
                  product={product}
                  gtm={gtmAddtoCart}
                  outOfStockLabel={outOfStockLabel}
                  beforeAddProductCallback={beforeAddProductCallback}
                />
              </div>
            </div>
          </div>
        );
    }
  },
);

ProductItem.propTypes = {
  className: PropTypes.string,
  img: PropTypes.string,
  price: PropTypes.node.isRequired,
  specialPrice: PropTypes.number.isRequired,
  priceLabel: PropTypes.string,
  addToCartLabel: PropTypes.string,
  outOfStockLabel: PropTypes.string,
  qty: PropTypes.number,
  promoNamesNode: PropTypes.node,
  promoIconsNode: PropTypes.node,
  loadingCartProduct: PropTypes.bool,
  productBadge: PropTypes.object,
  baseMediaUrl: PropTypes.string,
  trackingSection: PropTypes.string,
  trackingUserId: PropTypes.string,
  productType: PropTypes.string,
  beforeAddProductCallback: PropTypes.func,
};

ProductItem.defaultProps = {
  className: '',
  img: 'http://via.placeholder.com/350x250',
  promoNamesNode: null,
  promoIconsNode: null,
  priceLabel: 'ชิ้น',
  addToCartLabel: 'Add to Cart',
  outOfStockLabel: 'Out of Stock',
  loadingCartProduct: false,
  productBadge: {},
  baseMediaUrl: '',
  trackingSection: '',
  trackingUserId: '',
  productType: '',
  beforeAddProductCallback: noop,
};

export default withRouter(ProductItem);
