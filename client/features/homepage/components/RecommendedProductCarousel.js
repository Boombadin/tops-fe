import Cookie from 'js-cookie';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import size from 'lodash/size';
import React, { useEffect, useState } from 'react';

import ProductApi from '@client/apis/product';
import PreloadedProductCarousel from '@client/components/PreloadedProductCarousel';
import { useFirebaseContext } from '@client/contexts';
import withCustomer from '@client/hoc/withCustomer';
import withLocales from '@client/hoc/withLocales';
import { googleOptimize } from '@client/utils/googleOptimize';

function RecommendedProductCarousel({ translate, customer }) {
  const { firestoreAction } = useFirebaseContext();
  const userId = get(customer, 'id', '0').toString();
  const [productRecommended, setProductRecommended] = useState([]);

  useEffect(() => {
    (async () => {
      const dataCookieGAEXP = Cookie.get('_gaexp');
      const remoteConfigGoogleOptimize = await firestoreAction.getRemoteConfig(
        'google_optimize',
      );

      let isGoogleOptimize = '';
      if (!isEmpty(remoteConfigGoogleOptimize)) {
        const expIdRecommended =
          JSON.parse(remoteConfigGoogleOptimize)?.exp_id?.recommendation || '';

        isGoogleOptimize = googleOptimize(dataCookieGAEXP, expIdRecommended);
      }

      const customerId = get(customer, 'id', 0);
      const { products } = await ProductApi.getRecommendPersonalWithItem(
        customerId,
        isGoogleOptimize,
      );

      if (size(products) > 0) {
        setProductRecommended(products);
      }
    })();
  }, []);

  if (productRecommended.length <= 0) {
    return null;
  }

  return (
    <PreloadedProductCarousel
      id="recommended"
      ownProducts={productRecommended}
      title={translate('homepage.recommended')}
      button
      url="/recommended"
      isCustomSlide
      titlePosition="left"
      titleLine={false}
      btnName="homepage.show_all"
      trackingSection="homepage_recommendation"
      trackingUserId={userId}
      section="Recommended for you"
    />
  );
}

export default withLocales(withCustomer(RecommendedProductCarousel));
