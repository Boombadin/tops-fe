import prop from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';

import '@client/components/NotifyTooltip/NotifyTooltip.scss';

class NotifyTooltip extends PureComponent {
  static propTypes = {
    product: PropTypes.object.isRequired,
    notifyMaxQty: PropTypes.string,
    notifyOutOfStock: PropTypes.string,
    translate: PropTypes.func.isRequired,
    size: PropTypes.string,
    direction: PropTypes.string,
  };

  static defaultProps = {
    notifyMaxQty: '',
    notifyOutOfStock: '',
    size: '',
    direction: 'top',
  };

  state = {
    show: false,
    message: '',
  };

  componentDidMount() {
    document.addEventListener('click', this.resetNotice);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.resetNotice);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      (prevProps.notifyMaxQty === '' &&
        this.props.notifyMaxQty &&
        this.props.notifyMaxQty === this.props.product.sku) ||
      (prevProps.notifyOutOfStock === '' &&
        this.props.notifyOutOfStock &&
        this.props.notifyOutOfStock === this.props.product.sku) ||
      (isEmpty(prevProps.notifyLimitQty) &&
        !isEmpty(this.props.notifyLimitQty) &&
        this.props.notifyLimitQty.sku === this.props.product.sku)
    ) {
      this.handleShowNotify();
    }
  }

  handleShowNotify = () => {
    const { translate } = this.props;
    let message = '';

    if (this.props.notifyOutOfStock === this.props.product.sku) {
      message = translate('product.notification.out_of_stock');
    }

    if (this.props.notifyMaxQty === this.props.product.sku) {
      const maxQty = prop(
        this.props.product,
        'extension_attributes.stock_item.max_sale_qty',
      );
      message = translate('product.notification.max_qty', { qty: maxQty });
    }

    if (
      !isEmpty(this.props.notifyLimitQty) &&
      this.props.product.sku === this.props.notifyLimitQty.sku
    ) {
      const errorMessage = prop(this.props.notifyLimitQty, 'errorMessage');
      if (errorMessage === 'limit_qty_200') {
        message = translate('product.notification.limit_qty_200');
      } else {
        message =
          this.props.notifyLimitQty.errorMessage ||
          translate('product.notification.limit_qty');
      }
    }

    setTimeout(() => {
      this.setState({
        show: true,
        message: message,
      });
    }, 300);
  };

  resetNotice = () => {
    this.setState({
      show: false,
    });
  };

  render() {
    const sizeClass = this.props.size;
    const directionClass = this.props.direction;
    const showClass = this.state.show ? 'show' : '';
    return (
      <div
        className={`notify-tooltip--root ${sizeClass} ${directionClass} ${showClass}`}
      >
        <span className="notify-tooltip--text">{this.state.message}</span>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  notifyMaxQty: state.cart.notifyMaxQty,
  notifyOutOfStock: state.cart.notifyOutOfStock,
  notifyLimitQty: state.cart.notifyLimitQty,
  translate: getTranslate(state.locale),
});

export default connect(mapStateToProps)(NotifyTooltip);
