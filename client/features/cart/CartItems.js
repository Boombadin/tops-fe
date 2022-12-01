import { HideDesktop, HideMobile } from '@central-tech/core-ui';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';

import { TextGuide } from '@client/components/Typography';
import { hitTimeStamp } from '@client/constants/hitTimeStamp';
import CartDesktopItem from '@client/features/cart/components/CartDesktopItem';
import CartMobileItem from '@client/features/cart/components/CartMobileItem';
import { getCategoryInCart } from '@client/features/cart/utils/functions';
import { ProductNoQty } from '@client/features/gtm/models/Product';
import withLocales from '@client/hoc/withLocales';

class CartItems extends PureComponent {
  handlerViewProduct = item => {
    const urlKey = get(item, 'url_key', '');
    this.props.history.push(`/${urlKey}`);

    // GTM
    dataLayer.push({
      event: 'eec.CartProductClick',
      ecommerce: {
        click: {
          products: [ProductNoQty(item)],
        },
      },
      hit_timestamp: hitTimeStamp,
    });
  };

  renderCartItemMobile = product => {
    const { storeConfig, isMiniCart } = this.props;

    let consumerUnit = get(product, 'consumer_unit', '');
    const weightItemInd = product?.weight_item_ind;
    const sellingUnit = get(product, 'selling_unit', consumerUnit);

    if (weightItemInd === '1' && !isEmpty(sellingUnit)) {
      consumerUnit = sellingUnit;
    }

    return (
      <CartMobileItem
        pid={get(product, 'item_id', '')}
        sku={get(product, 'sku', '')}
        qty={get(product, 'qty', 0)}
        priceInclTax={get(product, 'base_price_incl_tax', 0)}
        discountAmount={
          get(product, 'original_price', 0) * get(product, 'qty', 0) -
          get(product, 'base_price_incl_tax', 0) * get(product, 'qty', 0)
        }
        image={get(product, 'image', '')}
        name={get(product, 'name', '')}
        specialBadge={get(product, 'special_badge', '')}
        extensionAttributes={get(product, 'extension_attributes', {})}
        the1cardStartdate={get(product, 'the1card_startdate')}
        the1cardEnddate={get(product, 'the1card_enddate')}
        the1cardPoint={get(product, 'the1card_point')}
        the1cardPerQty={get(product, 'the1card_qty')}
        consumerUnit={consumerUnit}
        specialPrice={get(product, 'special_price', 0)}
        originalPrice={get(product, 'original_price', get(product, 'price', 0))}
        specialToDate={get(product, 'extension_attributes.promotion.end_date')}
        customAttributesOption={get(product, 'custom_attributes_option', [])}
        storeConfig={storeConfig}
        onViewProduct={() => this.handlerViewProduct(product)}
        isMiniCart={isMiniCart}
        url={get(product, 'url_key', '')}
      />
    );
  };

  renderCartItemDesktop = product => {
    const { storeConfig } = this.props;

    let consumerUnit = get(product, 'consumer_unit', '');
    const weightItemInd = product?.weight_item_ind;
    const sellingUnit = get(product, 'selling_unit', consumerUnit);

    if (weightItemInd === '1' && !isEmpty(sellingUnit)) {
      consumerUnit = sellingUnit;
    }

    return (
      <CartDesktopItem
        pid={get(product, 'item_id', '')}
        sku={get(product, 'sku', '')}
        qty={get(product, 'qty', 0)}
        priceInclTax={get(product, 'base_price_incl_tax', 0)}
        discountAmount={
          get(product, 'original_price', 0) * get(product, 'qty', 0) -
          get(product, 'base_price_incl_tax', 0) * get(product, 'qty', 0)
        }
        promotionType={get(product, 'extension_attributes.promotion.type')}
        image={get(product, 'image', '')}
        name={get(product, 'name', '')}
        specialBadge={get(product, 'special_badge', '')}
        extensionAttributes={get(product, 'extension_attributes', {})}
        the1cardStartdate={get(product, 'the1card_startdate')}
        the1cardEnddate={get(product, 'the1card_enddate')}
        the1cardPoint={get(product, 'the1card_point')}
        the1cardPerQty={get(product, 'the1card_qty')}
        consumerUnit={consumerUnit}
        specialPrice={get(product, 'special_price', 0)}
        originalPrice={get(product, 'original_price', get(product, 'price', 0))}
        specialToDate={get(product, 'extension_attributes.promotion.end_date')}
        customAttributesOption={get(product, 'custom_attributes_option', [])}
        storeConfig={storeConfig}
        onViewProduct={() => this.handlerViewProduct(product)}
        url={get(product, 'url_key', '')}
      />
    );
  };

  render() {
    const { mainCategory, products, isMiniCart, translate } = this.props;
    const categoryInCart = getCategoryInCart(mainCategory, products);

    return map(categoryInCart, category => {
      return (
        <React.Fragment>
          <TextGuide
            xs="auto"
            type="caption-2"
            color="#2a2a2a"
            lineHeight="20px"
            padding={isMiniCart ? '0 19px' : '0 10px'}
            style={{ backgroundColor: '#f7f7f7' }}
          >
            {get(category, 'name', '') !== 'other'
              ? get(category, 'name', '')
              : translate(`cart.category_other`)}
          </TextGuide>
          {map(get(category, 'items', ''), product => {
            return !isMiniCart ? (
              <React.Fragment>
                <HideMobile>{this.renderCartItemDesktop(product)}</HideMobile>
                <HideDesktop>{this.renderCartItemMobile(product)}</HideDesktop>
              </React.Fragment>
            ) : (
              this.renderCartItemMobile(product)
            );
          })}
        </React.Fragment>
      );
    });
  }
}

export default withRouter(withLocales(CartItems));
