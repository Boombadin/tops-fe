import React, { PureComponent } from 'react';
import { get } from 'lodash';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getTranslate } from 'react-localize-redux';
import { openPromoBundleModal } from '../../reducers/promoBundle';
import { promoAvailableForBundleLink } from '../../utils/promoBundle';
import { createDate } from '../../utils/time';

import './PromoLink.scss';

class PromoLink extends PureComponent {
  static propTypes = {
    product: PropTypes.object.isRequired,
    openPromoBundleModal: PropTypes.func.isRequired,
  };

  state = {
    promotionType: null,
    promotionNo: null,
  };

  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps) {
    if (this.props.product !== prevProps.product) {
      this.init();
    }
  }

  init() {
    const { product } = this.props;
    const promotionNo = get(
      product,
      'extension_attributes.promotion.promotion_no',
      '',
    );
    const promotionType = get(
      product,
      'extension_attributes.promotion.type',
      '',
    );
    // promotionType = selectAvailableType(promotionType);
    this.setState({
      promotionType: promotionType.toLowerCase(),
      promotionNo: promotionNo,
    });
  }

  onPromoBundleLinkClick = e => {
    e.preventDefault();
    const { promotionNo, promotionType } = this.state;

    this.props.openPromoBundleModal(promotionNo, promotionType);
  };

  render() {
    const { promotionType } = this.state;
    const { translate, product } = this.props;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    let endPromotion = get(product, 'extension_attributes.promotion.end_date')
      ? createDate(get(product, 'extension_attributes.promotion.end_date'))
      : null;

    if (endPromotion && endPromotion.valueOf() < yesterday.valueOf()) {
      endPromotion = null;
    }

    const promType = get(product, 'extension_attributes.promotion.type', '');

    const isBundle = promoAvailableForBundleLink(promType);

    return (
      <div className="promotion-bundle--link">
        {isBundle && endPromotion && (
          <button onClick={e => this.onPromoBundleLinkClick(e)}>
            <span>
              {translate('promotion.select_product')}
              {translate(`promotion.${promotionType}`)}
              {/* {translate('promotion.select_product_free')} */}
            </span>
          </button>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  openPromoBundleModal: (promotionNo, promotionType) =>
    dispatch(openPromoBundleModal(promotionNo, promotionType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PromoLink);
