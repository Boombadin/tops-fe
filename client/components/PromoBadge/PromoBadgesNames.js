import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getTranslate } from 'react-localize-redux';
import ReactHtmlParser from 'react-html-parser';
import { get as prop, isEmpty } from 'lodash';
import './PromoBadge.scss';
import { getPromoName, getAllPromotionBadges } from './functions';

class PromoBadgesNames extends PureComponent {
  render() {
    const { product, storeConfig, translate } = this.props;

    if (!product) {
      return null;
    }
    const locale = storeConfig.locale.substring(0, 2);
    const textToday = translate('product.promotion_end_start');
    const productRemark = prop(product, 'product_remark', '');
    const promoBadges = getAllPromotionBadges(product, locale, textToday);
    return (
      <div className="promo-badges-names">
        {productRemark && (
          <div className="promo-name" key="product_remark">
            <div className="product-remark">
              {ReactHtmlParser(productRemark)}
            </div>
          </div>
        )}
        {promoBadges.map((value, idx) => {
          const name = getPromoName(
            storeConfig.extension_attributes[`${value.toLowerCase()}_name`] ||
              value,
            value,
            product,
            translate('order_detail.unit_item'),
          );

          if (isEmpty(name)) {
            return null;
          }

          return (
            <div className="promo-name" key={idx}>
              <span>{name}</span>
            </div>
          );
        })}
      </div>
    );
  }
}

PromoBadgesNames.propTypes = {
  product: PropTypes.object.isRequired,
  storeConfig: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  storeConfig: state.storeConfig.default,
  translate: getTranslate(state.locale),
});

export default connect(mapStateToProps)(PromoBadgesNames);
