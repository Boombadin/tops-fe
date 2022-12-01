import { HideDesktop, HideMobile } from '@central-tech/core-ui';
import isEmpty from 'lodash/isEmpty';
import React from 'react';

import CartDesktopPromotion from '@client/features/cart/components/CartDesktopPromotion';
import CartMobilePromotion from '@client/features/cart/components/CartMobilePromotion';
import { ProductNoQty } from '@client/features/gtm/models/Product';
import withLocales from '@client/hoc/withLocales';

const CartPromotions = ({
  item,
  productSkus,
  discountAmount,
  promoQtyStep,
  actionDiscountType,
  isMiniCart,
  bundle,
  storeConfig,
  handlerViewProduct,
  openPromoBundleModal,
  lang,
}) => {
  const promoCode = bundle?.name;
  const promoType = bundle?.description;
  const promotionLabel =
    lang?.code === 'th_TH' ? bundle?.label_th : bundle?.label_en;

  let consumerUnit = item?.consumer_unit || '';
  const weightItemInd = item?.weight_item_ind;
  const sellingUnit = item?.selling_unit?.consumerUnit;

  if (weightItemInd === '1' && !isEmpty(sellingUnit)) {
    consumerUnit = sellingUnit;
  }

  const productItem = {
    pid: item?.item_id || '',
    name: item?.name || '',
    image: item?.image || '',
    qty: promoQtyStep || item?.qty || 0,
    consumerUnit: consumerUnit,
  };

  let gtmData = ProductNoQty(item);
  gtmData = { ...gtmData, url_key: item?.url_key || '' };

  return !isMiniCart ? (
    <React.Fragment>
      <HideMobile>
        <CartDesktopPromotion
          productItem={productItem}
          productSkus={productSkus}
          discountAmount={discountAmount}
          promoCode={promoCode}
          promoType={promoType}
          gtmData={gtmData}
          actionDiscountType={actionDiscountType}
          promotionLabel={promotionLabel}
          baseMediaUrl={storeConfig?.base_media_url || ''}
          onViewProduct={handlerViewProduct}
          openPromoBundleModal={openPromoBundleModal}
        />
      </HideMobile>
      <HideDesktop>
        <CartMobilePromotion
          productItem={productItem}
          productSkus={productSkus}
          discountAmount={discountAmount}
          promoCode={promoCode}
          promoType={promoType}
          gtmData={gtmData}
          actionDiscountType={actionDiscountType}
          promotionLabel={promotionLabel}
          baseMediaUrl={storeConfig?.base_media_url || ''}
          onViewProduct={handlerViewProduct}
          openPromoBundleModal={openPromoBundleModal}
        />
      </HideDesktop>
    </React.Fragment>
  ) : (
    <CartMobilePromotion
      productItem={productItem}
      productSkus={productSkus}
      discountAmount={discountAmount}
      promoCode={promoCode}
      promoType={promoType}
      gtmData={gtmData}
      actionDiscountType={actionDiscountType}
      promotionLabel={promotionLabel}
      baseMediaUrl={storeConfig?.base_media_url || ''}
      onViewProduct={handlerViewProduct}
      openPromoBundleModal={openPromoBundleModal}
    />
  );
};

export default withLocales(CartPromotions);
