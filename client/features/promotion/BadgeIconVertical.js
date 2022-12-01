import React from 'react';
import { get } from 'lodash';
import styled from 'styled-components';
import { Icon, Row } from '@central-tech/core-ui';
import withLocales from '../../hoc/withLocales';
import { TextGuide } from '../../components/Typography';

const RowPromotion = styled(Row)`
  align-items: center;
`;

const BadgeIconVertical = ({ promoBadges }) => {
  return promoBadges.map(promotion => {
    const promotionType = get(promotion, 'type', '')
      .toLowerCase()
      .replace(' ', '');
    return (
      <RowPromotion>
        <Icon
          src={get(promotion, 'image.badge', '')}
          width={get(promotion, 'image.width', '')}
          height={get(promotion, 'image.height', '')}
        />
        {promotionType === 'sale' || promotionType === 'redhot' ? (
          <React.Fragment>
            {get(
              promotion,
              'promoName.priceProduct.showSpecialPrice',
              false,
            ) && (
              <TextGuide
                type="caption-2"
                color="#666666"
                padding="0 0 0 5px"
                lineThrough
              >
                {`${get(promotion, 'promoName.priceProduct.price', '0.00')}฿`}
              </TextGuide>
            )}
            <TextGuide type="caption-2" color="#ec1d24" padding="0 0 0 4px">
              {`${
                get(promotion, 'promoName.priceProduct.showSpecialPrice', false)
                  ? get(
                      promotion,
                      'promoName.priceProduct.specialPrice',
                      '0.00',
                    )
                  : get(promotion, 'promoName.priceProduct.price', '0.00')
              }฿/${get(promotion, 'promoName.unit', '')}`}
            </TextGuide>
          </React.Fragment>
        ) : (
          <TextGuide type="caption-2" color="#666666" padding="0 4px">
            {get(promotion, 'promoName.badgeName', '')}
          </TextGuide>
        )}
      </RowPromotion>
    );
  });
};

export default withLocales(BadgeIconVertical);
