import Cookie from 'js-cookie';
import isEmpty from 'lodash/isEmpty';
import size from 'lodash/size';
import React, { useEffect, useState } from 'react';

import ProductApi from '@client/apis/product';
import PreloadedProductCarousel from '@client/components/PreloadedProductCarousel';
import { useFirebaseContext } from '@client/contexts';
import withCustomer from '@client/hoc/withCustomer';
import withStoreConfig from '@client/hoc/withStoreConfig';
import { googleOptimize } from '@client/utils/googleOptimize';

function SimAndAssoProductCarousel({ storeConfig, customer, sku }) {
  const { firestoreAction } = useFirebaseContext();
  const userId = customer?.id;
  const store = storeConfig?.code;
  const [productAssociation, setProductAssociation] = useState({});
  const [productSimilarity, setProductSimilarity] = useState({});

  useEffect(() => {
    (async () => {
      const dataCookieGAEXP = Cookie.get('_gaexp');
      const remoteConfigGoogleOptimize = await firestoreAction.getRemoteConfig(
        'google_optimize',
      );

      let isGoogleOptimizeAssociation = '';
      let isGoogleOptimizeSimilarity = '';

      const expIdAssociation = JSON.parse(remoteConfigGoogleOptimize)?.exp_id
        ?.association;
      isGoogleOptimizeAssociation = googleOptimize(
        dataCookieGAEXP,
        expIdAssociation,
      );
      const expIdSimilarity = JSON.parse(remoteConfigGoogleOptimize)?.exp_id
        ?.similarity;
      isGoogleOptimizeSimilarity = googleOptimize(
        dataCookieGAEXP,
        expIdSimilarity,
      );

      const [similarity, association] = await Promise.all([
        ProductApi.getSimilarity(
          sku,
          store,
          userId,
          isGoogleOptimizeSimilarity,
        ),
        ProductApi.getAssociation(
          sku,
          store,
          userId,
          isGoogleOptimizeAssociation,
        ),
      ]);

      if (!isEmpty(association?.products)) {
        setProductAssociation(association?.products);
      }
      if (!isEmpty(similarity?.products)) {
        setProductSimilarity(similarity?.products);
      }
    })();
  }, []);

  if (size(productSimilarity) <= 0 && size(productAssociation) <= 0) {
    return null;
  }

  return (
    <React.Fragment>
      {size(productAssociation) > 0 && (
        <PreloadedProductCarousel
          id="association"
          ownProducts={productAssociation?.items}
          title={productAssociation?.name}
          trackingSection="association"
          trackingUserId={userId}
          section="Associate products"
          isCustomSlide
        />
      )}

      {size(productSimilarity) > 0 && (
        <PreloadedProductCarousel
          id="similarity"
          ownProducts={productSimilarity?.items}
          title={productSimilarity?.name}
          trackingSection="similarity"
          trackingUserId={userId}
          section="Similar products"
          isCustomSlide
        />
      )}
    </React.Fragment>
  );
}

export default withCustomer(withStoreConfig(SimAndAssoProductCarousel));
