import { HideDesktop, HideMobile } from '@central-tech/core-ui';
import chunk from 'lodash/chunk';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import size from 'lodash/size';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

import { hitTimeStamp } from '@client/constants/hitTimeStamp';
import CartDesktopItem from '@client/features/cart/components/CartDesktopItem';
import CartMobileItem from '@client/features/cart/components/CartMobileItem';
import CartPromotions from '@client/features/cart/components/CartPromotions';
import { simpleAction } from '@client/features/cart/utils/simpleAction';
import { ProductNoQty } from '@client/features/gtm/models/Product';
import withLocales from '@client/hoc/withLocales';
import withStoreConfig from '@client/hoc/withStoreConfig';
import { includeProduct } from '@client/utils/cart';
import { formatPrice } from '@client/utils/price';

const CartBundleItems = ({
  bundle,
  storeConfig,
  isMiniCart,
  history,
  openPromoBundleModal,
}) => {
  const [allowTooltipOnMount, setAllowTooltipOnMount] = useState(false);

  useEffect(() => {
    if (!allowTooltipOnMount) {
      setAllowTooltipOnMount(true);
    }
  }, [allowTooltipOnMount]);

  const handlerViewProduct = item => {
    const urlKey = get(item, 'url_key', '');
    history.push(`/${urlKey}`);

    delete item?.url_key;
    // GTM
    dataLayer.push({
      event: 'eec.CartProductClick',
      ecommerce: {
        click: {
          products: [item],
        },
      },
      hit_timestamp: hitTimeStamp,
    });
  };

  const renderCartItems = (typeRender, item, bundlePrice, productSkus) => {
    const promoQtyStep = bundle?.qty_step;
    const actionDiscountType = bundle?.action_discount_type;

    const discount = 0;
    let qty = get(item, 'qty', 0);
    if (typeRender === 'bundle') {
      if (
        actionDiscountType === simpleAction?.groupn &&
        !isEmpty(bundlePrice)
      ) {
        qty = promoQtyStep;
      }
    }

    let consumerUnit = get(item, 'consumer_unit', '');
    const weightItemInd = item?.weight_item_ind;
    const sellingUnit = get(item, 'selling_unit', consumerUnit);

    if (weightItemInd === '1' && !isEmpty(sellingUnit)) {
      consumerUnit = sellingUnit;
    }

    return !isMiniCart ? (
      <React.Fragment>
        <HideMobile>
          <CartDesktopItem
            allowTooltipOnMount={allowTooltipOnMount}
            pid={get(item, 'item_id', '')}
            sku={get(item, 'sku', '')}
            qty={qty}
            priceInclTax={get(item, 'base_price_incl_tax', 0)}
            discountAmount={discount}
            image={get(item, 'image', '')}
            name={get(item, 'name', '')}
            specialBadge={get(item, 'special_badge', '')}
            extensionAttributes={get(item, 'extension_attributes', {})}
            the1cardStartdate={get(item, 'the1card_startdate')}
            the1cardEnddate={get(item, 'the1card_enddate')}
            the1cardPoint={get(item, 'the1card_point')}
            the1cardPerQty={get(item, 'the1card_qty')}
            consumerUnit={consumerUnit}
            specialPrice={get(item, 'special_price', 0)}
            originalPrice={get(item, 'original_price', get(item, 'price', 0))}
            specialToDate={get(item, 'extension_attributes.promotion.end_date')}
            customAttributesOption={get(item, 'custom_attributes_option', [])}
            storeConfig={storeConfig}
            productSkus={productSkus}
            promoQtyStep={promoQtyStep}
            type={typeRender}
            onViewProduct={() => handlerViewProduct(item)}
            url={get(item, 'url_key', '')}
          />
        </HideMobile>
        <HideDesktop>
          <CartMobileItem
            allowTooltipOnMount={allowTooltipOnMount}
            pid={get(item, 'item_id', '')}
            sku={get(item, 'sku', '')}
            qty={qty}
            priceInclTax={get(item, 'base_price_incl_tax', 0)}
            discountAmount={discount}
            image={get(item, 'image', '')}
            name={get(item, 'name', '')}
            specialBadge={get(item, 'special_badge', '')}
            extensionAttributes={get(item, 'extension_attributes', {})}
            the1cardStartdate={get(item, 'the1card_startdate')}
            the1cardEnddate={get(item, 'the1card_enddate')}
            the1cardPoint={get(item, 'the1card_point')}
            the1cardPerQty={get(item, 'the1card_qty')}
            consumerUnit={consumerUnit}
            specialPrice={get(item, 'special_price', 0)}
            originalPrice={get(item, 'original_price', get(item, 'price', 0))}
            specialToDate={get(item, 'extension_attributes.promotion.end_date')}
            customAttributesOption={get(item, 'custom_attributes_option', [])}
            storeConfig={storeConfig}
            productSkus={productSkus}
            promoQtyStep={promoQtyStep}
            onViewProduct={() => handlerViewProduct(item)}
            type={typeRender}
            isMiniCart={isMiniCart}
            url={get(item, 'url_key', '')}
          />
        </HideDesktop>
      </React.Fragment>
    ) : (
      <CartMobileItem
        allowTooltipOnMount={allowTooltipOnMount}
        pid={get(item, 'item_id', '')}
        sku={get(item, 'sku', '')}
        qty={qty}
        priceInclTax={get(item, 'base_price_incl_tax', 0)}
        discountAmount={discount}
        image={get(item, 'image', '')}
        name={get(item, 'name', '')}
        specialBadge={get(item, 'special_badge', '')}
        extensionAttributes={get(item, 'extension_attributes', {})}
        the1cardStartdate={get(item, 'the1card_startdate')}
        the1cardEnddate={get(item, 'the1card_enddate')}
        the1cardPoint={get(item, 'the1card_point')}
        the1cardPerQty={get(item, 'the1card_qty')}
        consumerUnit={consumerUnit}
        specialPrice={get(item, 'special_price', 0)}
        originalPrice={get(item, 'original_price', get(item, 'price', 0))}
        specialToDate={get(item, 'extension_attributes.promotion.end_date')}
        customAttributesOption={get(item, 'custom_attributes_option', [])}
        storeConfig={storeConfig}
        productSkus={productSkus}
        promoQtyStep={promoQtyStep}
        onViewProduct={() => handlerViewProduct(item)}
        type={typeRender}
        isMiniCart={isMiniCart}
        url={get(item, 'url_key', '')}
      />
    );
  };

  const calBundlePrice = (bundle, items) => {
    const bundleStep = bundle.qty_step;
    const discountAmount = bundle.discount_amount;
    const actionDiscountType = bundle.action_discount_type;

    let price = 0;
    let discount = 0;
    let total = 0;

    map(items, item => {
      price += item.base_price_incl_tax;
    });

    if (actionDiscountType === simpleAction?.central_eachn_percent_discount) {
      const discountPercent = discountAmount;
      discount = (price / bundleStep) * (discountPercent / 100);
      total = price - discount;
    } else if (actionDiscountType === simpleAction?.groupn) {
      discount = price - discountAmount;
      total = discountAmount;
    } else if (
      actionDiscountType === simpleAction?.cart_fixed ||
      simpleAction?.groupn_fixdisc
    ) {
      discount = discountAmount;
      total = discountAmount;
    }

    return {
      price: formatPrice(price),
      discount: formatPrice(discount),
      total: formatPrice(total),
    };
  };

  const promoItems = bundle.items;
  const promoQtyStep = bundle.qty_step;
  const actionDiscountType = bundle.action_discount_type;

  let itemChunks = chunk(promoItems, promoQtyStep);

  if (actionDiscountType === simpleAction?.cart_fixed) {
    itemChunks = [promoItems];
  }

  return map(itemChunks, chunk => {
    let isMatchQty = chunk.length === promoQtyStep;
    if (actionDiscountType === simpleAction?.cart_fixed) {
      isMatchQty = true;
    }

    const productSkus = map(chunk, item => {
      return item.sku;
    });

    if (isMatchQty) {
      const bundlePriceDetail = calBundlePrice(bundle, chunk);
      let groubItem;
      let freeItem;
      if (actionDiscountType === simpleAction?.central_eachn_percent_discount) {
        if (size(chunk) > 0) {
          groubItem = includeProduct(chunk.slice(0, promoQtyStep - 1));
          freeItem = chunk.slice(promoQtyStep - 1);
        }
      } else {
        chunk = includeProduct(chunk);
      }

      let totalsQty = 0;

      return (
        <div className="row detail bundle">
          <div className="description bundle">
            <div className="bundle-img">
              {actionDiscountType ===
              simpleAction?.central_eachn_percent_discount ? (
                <React.Fragment>
                  {map(groubItem, item => {
                    totalsQty = totalsQty + get(item, 'qty', 0);
                    if (totalsQty < promoQtyStep) {
                      return renderCartItems('bundle', item);
                    }
                    {
                      return (
                        <CartPromotions
                          item={freeItem}
                          productSkus={productSkus}
                          discountAmount={bundlePriceDetail?.discount || 0}
                          promoQtyStep={item?.qty || 0}
                          actionDiscountType={actionDiscountType}
                          isMiniCart={isMiniCart}
                          bundle={bundle}
                          storeConfig={storeConfig}
                          handlerViewProduct={handlerViewProduct}
                          openPromoBundleModal={openPromoBundleModal}
                        />
                      );
                    }
                  })}
                  {map(freeItem, item => {
                    totalsQty = totalsQty + get(item, 'qty', 0);
                    if (totalsQty < promoQtyStep) {
                      return renderCartItems('bundle', item);
                    }
                    {
                      return (
                        <CartPromotions
                          item={item}
                          productSkus={productSkus}
                          discountAmount={bundlePriceDetail?.discount || 0}
                          promoQtyStep={item?.qty || 0}
                          actionDiscountType={actionDiscountType}
                          isMiniCart={isMiniCart}
                          bundle={bundle}
                          storeConfig={storeConfig}
                          handlerViewProduct={handlerViewProduct}
                          openPromoBundleModal={openPromoBundleModal}
                        />
                      );
                    }
                  })}
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {map(chunk, item => {
                    return renderCartItems(
                      'bundle',
                      item,
                      chunk.length === 1 && bundlePriceDetail,
                    );
                  })}
                  {
                    <CartPromotions
                      item={get(chunk, '0', {})}
                      productSkus={productSkus}
                      discountAmount={bundlePriceDetail?.discount || 0}
                      promoQtyStep={promoQtyStep}
                      actionDiscountType={actionDiscountType}
                      isMiniCart={isMiniCart}
                      bundle={bundle}
                      storeConfig={storeConfig}
                      handlerViewProduct={handlerViewProduct}
                      openPromoBundleModal={openPromoBundleModal}
                    />
                  }
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      );
    }

    const leftChunks = includeProduct(chunk);
    return leftChunks.map(item => {
      return renderCartItems('product_bundle', item, {}, productSkus);
    });
  });
};

export default withRouter(withLocales(withStoreConfig(CartBundleItems)));
