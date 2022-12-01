import React from 'react';
import { get, uniq } from 'lodash';
import moment from 'moment';
import { Icon, HideMobile, HideDesktop } from '@central-tech/core-ui';
import withLocales from '../../hoc/withLocales';
import { createDate } from '../../utils/time';
import { getCustomAttribute, getPrice } from './utils/functions';
import BadgeIconVertical from './BadgeIconVertical';
import BadgeIconHorizontal from './BadgeIconHorizontal';

const BadgeIcon = ({
  specialBadge,
  extensionAttributes,
  the1cardStartdate,
  the1cardEnddate,
  the1cardPoint,
  the1cardPerQty,
  consumerUnit,
  specialPrice,
  originalPrice,
  specialToDate,
  storeConfig,
  width,
  height,
  translate,
  isMiniCart = false,
  customAttributesOption,
}) => {
  const specialBadges = get(
    storeConfig,
    'extension_attributes.special_badge',
    [],
  );
  const specialBadgeCode = specialBadges.map(item => item.attribute_code);
  const keyBadge = {};
  specialBadges.forEach(item => {
    keyBadge[item.attribute_code] = item.value;
  });

  const badge = specialBadge;
  const isSpecialBadge = specialBadgeCode.includes(badge);

  let promoBadges = [];
  if (
    get(extensionAttributes, 'promotion.type') &&
    get(extensionAttributes, 'promotion.end_date')
  ) {
    const currentTime = moment().format('YYYY-MM-DD HH:mm');
    const endPromotion = moment(
      get(extensionAttributes, 'promotion.end_date'),
      '',
    )
      .add(25200000 - 36000, 'ms')
      .format('YYYY-MM-DD HH:mm');

    if (currentTime <= endPromotion) {
      promoBadges = get(extensionAttributes, 'promotion.type', '').split();
    }
  }

  const startMoneyBack = createDate(the1cardStartdate);
  const yesterday = new Date();

  yesterday.setDate(yesterday.getDate());

  let endMoneyBack = the1cardEnddate ? createDate(the1cardEnddate) : null;

  if (
    endMoneyBack &&
    Date.now().valueOf() >= startMoneyBack.valueOf() &&
    endMoneyBack.valueOf() >= yesterday.valueOf()
  ) {
    promoBadges = [...promoBadges, 'MONEYBACK'];
  } else {
    endMoneyBack = null;
  }

  promoBadges = uniq(promoBadges);
  if (isSpecialBadge) {
    const img = `${storeConfig.base_media_url}${keyBadge[badge]}`;
    return <Icon src={img} width={width} height={height} />;
  }

  const promotionBadge = [];
  promoBadges.map(value => {
    const badgeName = value.toLowerCase().replace(' ', '');
    const storeImage = get(
      storeConfig,
      `extension_attributes[${badgeName}_image]`,
      '',
    );

    if (!storeImage) {
      return null;
    }

    let promoName;
    if (badgeName === 'sale' || badgeName === 'redhot') {
      let unit = '';
      if (consumerUnit) {
        unit = consumerUnit;
      } else {
        unit =
          getCustomAttribute(customAttributesOption, 'consumer_unit') ||
          translate('product.default_consumer_unit');
      }

      const priceProduct = getPrice(specialPrice, originalPrice, specialToDate);

      promoName = {
        badgeName: translate(`promotion.${badgeName}`),
        priceProduct,
        unit,
      };
    } else {
      promoName = {
        badgeName: translate(`promotion.${badgeName}`, {
          point: parseFloat(the1cardPoint, 2),
          qty: parseFloat(the1cardPerQty, 2),
          unit: consumerUnit,
        }),
      };
    }

    const image = `${storeConfig.base_media_url}${storeImage}`;

    promotionBadge.push({
      type: badgeName,
      image: {
        badge: image,
        width,
        height,
      },
      promoName,
    });
  });

  return !isMiniCart ? (
    <React.Fragment>
      <HideDesktop>
        <BadgeIconVertical promoBadges={promotionBadge} />
      </HideDesktop>
      <HideMobile>
        <BadgeIconHorizontal promoBadges={promotionBadge} />
      </HideMobile>
    </React.Fragment>
  ) : (
    <BadgeIconVertical promoBadges={promotionBadge} />
  );
};

export default withLocales(BadgeIcon);
