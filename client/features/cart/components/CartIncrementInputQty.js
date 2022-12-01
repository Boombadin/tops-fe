import {
  Icon,
  IncrementInputBox,
  Padding,
  Tooltip,
} from '@central-tech/core-ui';
import { find, get, isEmpty } from 'lodash';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';

import { TextGuide } from '@client/components/Typography';
import withCartContext from '@client/hoc/withCartContext';
import withLocales from '@client/hoc/withLocales';
import { calculateLimitQty, calculateQty } from '@client/utils/cart';

const IconImage = styled(Icon)`
  cursor: pointer;

  ${props =>
    props.isDisabled &&
    `filter: grayscale(100%);
    opacity: 0.3;
  `}
`;

const IncrementInputQty = styled(IncrementInputBox)`
  height: 28px;
`;

const ItemQty = css`
  width: 40px;
  height: 28px;
  border-radius: 4px;
  border: solid 1px #bfbfbf;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  margin: 15px 11px 15px 11px;
`;

const PaddingTooltip = styled(Padding)`
  font-size: 12px;
  line-height: 22px;
`;

@withLocales
@withCartContext
class CartIncrementInputQty extends PureComponent {
  state = {
    show: false,
    message: '',
  };

  componentDidMount() {
    document.addEventListener('click', this.resetNotice);

    const {
      allowTooltipOnMount,
      notifyMaxQty,
      notifyOutOfStock,
      notifyLimitQty,
      sku,
    } = this.props;
    if (
      allowTooltipOnMount &&
      (notifyMaxQty === sku ||
        notifyOutOfStock === sku ||
        notifyLimitQty?.sku === sku)
    ) {
      this.handleShowNotify();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.resetNotice);
  }

  componentDidUpdate(prevProps) {
    const { sku } = this.props;
    if (
      (prevProps.notifyMaxQty === '' &&
        this.props.notifyMaxQty &&
        this.props.notifyMaxQty === sku) ||
      (prevProps.notifyOutOfStock === '' &&
        this.props.notifyOutOfStock &&
        this.props.notifyOutOfStock === sku) ||
      (isEmpty(prevProps.notifyLimitQty) &&
        !isEmpty(this.props.notifyLimitQty) &&
        this.props.notifyLimitQty.sku === sku)
    ) {
      this.handleShowNotify();
    }
  }

  messageMaxQty = () => {
    const { translate, extensionAttributes } = this.props;
    const maxQty = get(extensionAttributes, 'stock_item.max_sale_qty');
    return translate('product.notification.max_qty', { qty: maxQty });
  };

  messageMaxStockQty = () => {
    const { translate } = this.props;
    return translate('product.notification.out_of_stock');
  };

  showTooltipMaxQty = typeLimit => {
    const message =
      typeLimit === 'maxsale'
        ? this.messageMaxQty()
        : this.messageMaxStockQty();

    setTimeout(() => {
      this.setState({
        show: true,
        message: message,
      });
    }, 300);
  };

  handleShowNotify = () => {
    const { translate, sku } = this.props;
    let message = '';

    if (this.props.notifyOutOfStock === sku) {
      message = translate('product.notification.out_of_stock');
    }

    if (this.props.notifyMaxQty === sku) {
      message = this.messageMaxQty();
    }

    if (
      !isEmpty(this.props.notifyLimitQty) &&
      sku === this.props.notifyLimitQty.sku
    ) {
      if (this.props.notifyLimitQty.errorMessage === 'limit_qty_200') {
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
    const {
      pid,
      sku,
      extensionAttributes,
      qty,
      alignTooltip,
      type,
      cart,
      tooltipPosition,
      cartAction,
    } = this.props;
    const { show, message } = this.state;
    const maxSaleQty = get(extensionAttributes, 'stock_item.max_sale_qty');
    const maxStockQty = get(extensionAttributes, 'stock_item.qty');

    let limitMaxQty = maxSaleQty;
    let typeLimit = 'maxsale';
    if (maxSaleQty > maxStockQty) {
      typeLimit = 'outofstock';
      limitMaxQty = get(extensionAttributes, 'stock_item.qty');
    }

    const product = find(get(cart, 'items', {}), item => item.item_id === pid);
    const qtyInCart = get(product, 'qty', 1);
    const calMaxLimitQty = calculateLimitQty(limitMaxQty, qtyInCart, qty, type);

    let maxLimitQty = calMaxLimitQty;
    if (calMaxLimitQty <= 0) {
      maxLimitQty = 1;
    }

    return (
      <Tooltip
        align={alignTooltip}
        show={show}
        disabled={!show}
        radius={5}
        arrowColor="#fff3e4"
        border="1px solid #ff8e00"
        style={{
          display: 'inline-block',
          color: '#ff8e00',
        }}
        position={tooltipPosition || 'bottom'}
        renderTooltip={
          <PaddingTooltip
            xs="15px 32px 15px 10px"
            style={{
              width: 200,
              background: '#fff3e4',
              borderRadius: 5,
              display: 'flex',
            }}
          >
            <Icon
              src="/assets/icons/round-priority-high-24-px.svg"
              width={24}
              height={24}
              style={{
                marginRight: '2px',
                alignSelf: 'center',
              }}
            />
            <TextGuide type="caption-2" color="#ff8e00">
              {message}
            </TextGuide>
          </PaddingTooltip>
        }
      >
        <IncrementInputQty
          inputId={`txt-cartQty-sku${sku}`}
          defaultValue={qty}
          onUpdateCompleted={newQty =>
            cartAction.changeProductQty({
              productSku: sku,
              qty: calculateQty(qty, newQty, qtyInCart, type),
            })
          }
          editable={false}
          inputStyle={ItemQty}
          maxValue={maxLimitQty}
          minValue={1}
          renderButton={direction =>
            direction === 'inc' ? (
              <IconImage
                id={`btn-editCartPlus-sku${sku}`}
                src="/assets/icons/plus.svg"
                width={21}
                height={21}
              />
            ) : (
              <IconImage
                id={`btn-editCartMinus-sku${sku}`}
                src="/assets/icons/minus.svg"
                width={21}
                height={21}
              />
            )
          }
          renderButtonDisabled={direction =>
            direction === 'inc' ? (
              <IconImage
                id={`btn-editCartPlus-sku${sku}`}
                src="/assets/icons/plus.svg"
                width={21}
                height={21}
                isDisabled
                onClick={() => this.showTooltipMaxQty(typeLimit)}
              />
            ) : (
              <IconImage
                id={`btn-editCartMinus-sku${sku}`}
                src="/assets/icons/minus.svg"
                width={21}
                height={21}
                isDisabled
              />
            )
          }
        />
      </Tooltip>
    );
  }
}

const mapStateToProps = state => ({
  cart: state.cart.cart,
  notifyMaxQty: state.cart.notifyMaxQty,
  notifyOutOfStock: state.cart.notifyOutOfStock,
  notifyLimitQty: state.cart.notifyLimitQty,
});

export default connect(mapStateToProps)(CartIncrementInputQty);
