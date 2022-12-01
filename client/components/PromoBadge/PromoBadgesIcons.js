import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import { find, get as prop, uniq } from 'lodash';
import { createDate } from '../../utils/time';
import { Image } from '../../magenta-ui';
import './PromoBadge.scss';

class PromoBadgesIcons extends PureComponent {
  getCustomAttribute = attrName => {
    return prop(
      find(
        this.props.product.custom_attributes_option,
        attr => attr.attribute_code === attrName,
      ),
      'value',
      null,
    );
  };

  render() {
    const { product, storeConfig } = this.props;
    const specialBadges = prop(
      storeConfig,
      'extension_attributes.special_badge',
      [],
    );
    const specialBadgeCode = specialBadges.map(item => item.attribute_code);
    const keyBadge = {};
    specialBadges.forEach(item => {
      keyBadge[item.attribute_code] = item.value;
    });
    const badge = prop(product, 'special_badge', '');
    const isSpecialBadge = specialBadgeCode.includes(badge);
    if (!product) {
      return null;
    }

    let promoBadges = [];
    if (
      prop(product, 'extension_attributes.promotion.type') &&
      prop(product, 'extension_attributes.promotion.end_date')
    ) {
      const currentTime = moment().format('YYYY-MM-DD HH:mm');
      const endPromotion = moment(
        prop(product, 'extension_attributes.promotion.end_date'),
        '',
      )
        .add(25200000 - 36000, 'ms')
        .format('YYYY-MM-DD HH:mm');

      if (currentTime <= endPromotion) {
        promoBadges = prop(
          product,
          'extension_attributes.promotion.type',
          '',
        ).split();
      }
    } else {
      const currentTime = moment().format('YYYY-MM-DD HH:mm');
      const endPromotion = product?.promotion_end
        ? moment(product?.promotion_end || '')
            .add(25200000 - 36000, 'ms')
            .format('YYYY-MM-DD HH:mm')
        : '';

      if (currentTime <= endPromotion) {
        promoBadges = prop(product, 'promotion_type', []);
      }
    }

    const startMoneyBack = createDate(product.the1card_startdate);
    const yesterday = new Date();

    yesterday.setDate(yesterday.getDate());

    let endMoneyBack = product.the1card_enddate
      ? createDate(product.the1card_enddate)
      : null;
    // const endPromotion = product.promotion_end ? createDate(product.promotion_end) : null;

    // if ((endPromotion && endPromotion.valueOf() < yesterday.valueOf()) || !endPromotion) {
    //   endPromotion = null;
    //   promoBadges = [];
    // }

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
      return (
        <div className="promo-badges">
          <Image src={img} className="promo-image" />
        </div>
      );
    }

    return (
      <div className="promo-badges">
        {promoBadges.map((value, idx) => {
          const storeImage =
            storeConfig.extension_attributes[
              `${value.toLowerCase().replace(' ', '')}_image`
            ];

          if (!storeImage) {
            return null;
          }

          const image = `${storeConfig.base_media_url}${storeImage}`;

          return <Image key={idx} src={image} className="promo-image" />;
        })}
      </div>
    );
  }
}

PromoBadgesIcons.propTypes = {
  product: PropTypes.object.isRequired,
  storeConfig: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  storeConfig: state.storeConfig.default,
});

export default connect(mapStateToProps)(PromoBadgesIcons);
